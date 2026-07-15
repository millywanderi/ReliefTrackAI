#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.distribution_event import DistributionEvent
from app.models.distribution_resource import DistributionResource
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


def create_distribution_resource(
    db: Session,
    allocation,
):

    event = db.query(
        DistributionEvent
    ).filter(
        DistributionEvent.id == allocation.distribution_event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Distribution event not found."
        )

    resource = db.query(
        Resource
    ).filter(
        Resource.id == allocation.resource_id
    ).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found."
        )

    duplicate = (
        db.query(
            DistributionResource
        )
        .filter(
            DistributionResource.distribution_event_id
            == allocation.distribution_event_id,
            DistributionResource.resource_id
            == allocation.resource_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Resource already allocated to this distribution."
        )

    available_stock = get_current_stock(
        db,
        event.warehouse_id,
        allocation.resource_id,
    )

    if allocation.quantity > available_stock:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {available_stock} units available in warehouse."
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
    return db.query(DistributionResource).all()


def get_distribution_resource(
    db: Session,
    allocation_id: int,
):

    allocation = (
        db.query(
            DistributionResource
        )
        .filter(
            DistributionResource.id == allocation_id
        )
        .first()
    )

    if not allocation:
        raise HTTPException(
            status_code=404,
            detail="Allocation not found."
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
