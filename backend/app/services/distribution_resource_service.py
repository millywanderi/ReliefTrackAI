#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.distribution_event import DistributionEvent
from app.models.distribution_resource import DistributionResource
from app.models.distribution_verification import DistributionVerification
from app.models.resource import Resource
from app.models.stock_transaction import StockTransaction


def get_current_stock(
    db: Session,
    warehouse_id: int,
    resource_id: int,
):
    stock = (
        db.query(
            func.sum(
                case(
                    (
                        StockTransaction.transaction_type.in_(
                            [
                                "STOCK_IN",
                                "TRANSFER_IN",
                                "ADJUSTMENT",
                            ]
                        ),
                        StockTransaction.quantity,
                    ),
                    else_=-StockTransaction.quantity,
                )
            )
        )
        .filter(
            StockTransaction.warehouse_id == warehouse_id,
            StockTransaction.resource_id == resource_id,
        )
        .scalar()
    )

    return stock or 0


def get_reserved_quantity(
    db: Session,
    warehouse_id: int,
    resource_id: int,
    exclude_event_id: int | None = None,
):
    allocations = (
        db.query(DistributionResource)
        .join(
            DistributionEvent,
            DistributionEvent.id
            == DistributionResource.distribution_event_id,
        )
        .filter(
            DistributionEvent.warehouse_id == warehouse_id,
            DistributionResource.resource_id == resource_id,
            DistributionEvent.status != "Cancelled",
        )
        .all()
    )

    reserved_quantity = 0

    for allocation in allocations:

        if (
            exclude_event_id is not None
            and allocation.distribution_event_id
            == exclude_event_id
        ):
            continue

        delivered_quantity = (
            db.query(
                func.coalesce(
                    func.sum(
                        DistributionVerification.quantity
                    ),
                    0,
                )
            )
            .filter(
                DistributionVerification.distribution_event_id
                == allocation.distribution_event_id,
                DistributionVerification.resource_id
                == resource_id,
                DistributionVerification.status
                == "Delivered",
            )
            .scalar()
        )

        remaining_quantity = (
            allocation.quantity - delivered_quantity
        )

        if remaining_quantity > 0:
            reserved_quantity += remaining_quantity

    return reserved_quantity


def get_available_stock(
    db: Session,
    warehouse_id: int,
    resource_id: int,
    exclude_event_id: int | None = None,
):
    current_stock = get_current_stock(
        db,
        warehouse_id,
        resource_id,
    )

    reserved_quantity = get_reserved_quantity(
        db,
        warehouse_id,
        resource_id,
        exclude_event_id,
    )

    available_stock = (
        current_stock - reserved_quantity
    )

    return max(available_stock, 0)


def create_distribution_resource(
    db: Session,
    allocation,
):
    event = (
        db.query(DistributionEvent)
        .filter(
            DistributionEvent.id
            == allocation.distribution_event_id
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Distribution event not found.",
        )

    if event.status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail="Cannot allocate resources to a cancelled distribution event.",
        )

    if event.status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Cannot allocate resources to a completed distribution event.",
        )

    resource = (
        db.query(Resource)
        .filter(
            Resource.id == allocation.resource_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found.",
        )

    if allocation.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Allocation quantity must be greater than zero.",
        )

    existing_allocation = (
        db.query(DistributionResource)
        .filter(
            DistributionResource.distribution_event_id
            == allocation.distribution_event_id,
            DistributionResource.resource_id
            == allocation.resource_id,
        )
        .first()
    )

    if existing_allocation:

        additional_available = get_available_stock(
            db,
            event.warehouse_id,
            allocation.resource_id,
            exclude_event_id=event.id,
        )

        if allocation.quantity > additional_available:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only {additional_available} additional "
                    f"units are available for allocation."
                ),
            )

        existing_allocation.quantity += (
            allocation.quantity
        )

        db.commit()
        db.refresh(existing_allocation)

        return existing_allocation

    available_stock = get_available_stock(
        db,
        event.warehouse_id,
        allocation.resource_id,
    )

    if allocation.quantity > available_stock:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {available_stock} units are "
                f"available for allocation."
            ),
        )

    distribution_resource = DistributionResource(
        distribution_event_id=allocation.distribution_event_id,
        resource_id=allocation.resource_id,
        quantity=allocation.quantity,
    )

    db.add(distribution_resource)
    db.commit()
    db.refresh(distribution_resource)

    return distribution_resource


def get_all_distribution_resources(db: Session):
    return (
        db.query(DistributionResource)
        .all()
    )


def get_distribution_resource(
    db: Session,
    allocation_id: int,
):
    allocation = (
        db.query(DistributionResource)
        .filter(
            DistributionResource.id
            == allocation_id
        )
        .first()
    )

    if not allocation:
        raise HTTPException(
            status_code=404,
            detail="Allocation not found.",
        )

    return allocation


def delete_distribution_resource(
    db: Session,
    allocation_id: int,
):
    allocation = get_distribution_resource(
        db,
        allocation_id,
    )

    db.delete(allocation)
    db.commit()

    return {
        "message": "Allocation deleted successfully."
    }
