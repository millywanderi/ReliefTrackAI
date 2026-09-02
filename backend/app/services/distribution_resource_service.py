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
    exclude_distribution_event_id: int | None = None,
):
    query = (
        db.query(
            func.sum(DistributionResource.quantity)
        )
        .join(
            DistributionEvent,
            DistributionEvent.id
            == DistributionResource.distribution_event_id,
        )
        .filter(
            DistributionEvent.warehouse_id == warehouse_id,
            DistributionResource.resource_id == resource_id,
            DistributionEvent.status.notin_(
                ["Completed", "Cancelled"]
            ),
        )
    )

    if exclude_distribution_event_id is not None:
        query = query.filter(
            DistributionResource.distribution_event_id
            != exclude_distribution_event_id
        )

    return query.scalar() or 0


def get_available_stock(
    db: Session,
    warehouse_id: int,
    resource_id: int,
    exclude_distribution_event_id: int | None = None,
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
        exclude_distribution_event_id,
    )

    available_stock = current_stock - reserved_quantity

    return max(available_stock, 0)


def create_distribution_resource(
    db: Session,
    allocation,
):
    # ---------------------------------------------------------
    # 1. Check that the distribution event exists
    # ---------------------------------------------------------
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

    # ---------------------------------------------------------
    # 2. Only Planned or In Progress events can receive
    #    allocations.
    # ---------------------------------------------------------
    if event.status in {"Completed", "Cancelled"}:
        raise HTTPException(
            status_code=400,
            detail=(
                "Resources cannot be allocated to a "
                f"{event.status.lower()} distribution event."
            ),
        )

    # ---------------------------------------------------------
    # 3. Check that the resource exists
    # ---------------------------------------------------------
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

    # ---------------------------------------------------------
    # 4. Validate quantity
    # ---------------------------------------------------------
    if allocation.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Allocation quantity must be greater than zero.",
        )

    # ---------------------------------------------------------
    # 5. Find existing allocation for this event/resource
    # ---------------------------------------------------------
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

    # ---------------------------------------------------------
    # 6. Calculate stock available for this allocation.
    #
    # Existing allocation for THIS event is excluded because
    # it is already part of the event's reservation.
    # ---------------------------------------------------------
    available_stock = get_available_stock(
        db,
        event.warehouse_id,
        allocation.resource_id,
        exclude_distribution_event_id=(
            allocation.distribution_event_id
        ),
    )

    # ---------------------------------------------------------
    # 7. Existing allocation:
    #    increase its quantity if enough unreserved stock exists.
    # ---------------------------------------------------------
    if existing_allocation:

        new_total = (
            existing_allocation.quantity
            + allocation.quantity
        )

        current_event_allocation = (
            existing_allocation.quantity
        )

        if allocation.quantity > available_stock:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only {available_stock} additional "
                    f"units available for this resource. "
                    f"Existing allocation: "
                    f"{current_event_allocation}, "
                    f"requested additional quantity: "
                    f"{allocation.quantity}."
                ),
            )

        existing_allocation.quantity = new_total

        db.commit()
        db.refresh(existing_allocation)

        return existing_allocation

    # ---------------------------------------------------------
    # 8. New allocation
    # ---------------------------------------------------------
    if allocation.quantity > available_stock:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {available_stock} units available "
                f"for allocation in this warehouse."
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
