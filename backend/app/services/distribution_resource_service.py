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
    # 2. Check that the resource exists
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
    # 3. Validate quantity
    # ---------------------------------------------------------
    if allocation.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Allocation quantity must be greater than zero.",
        )

    # ---------------------------------------------------------
    # 4. Find any existing allocation for the same
    #    distribution event + resource
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
    # 5. Get current warehouse stock
    # ---------------------------------------------------------
    available_stock = get_current_stock(
        db,
        event.warehouse_id,
        allocation.resource_id,
    )

    # ---------------------------------------------------------
    # 6. If an allocation already exists, add the new
    #    quantity to the existing allocation.
    #
    #    Example:
    #       Existing allocation = 100
    #       New allocation      = 20
    #       New total           = 120
    # ---------------------------------------------------------
    if existing_allocation:
        new_total = (
            existing_allocation.quantity
            + allocation.quantity
        )

        if new_total > available_stock:
            additional_available = (
                available_stock
                - existing_allocation.quantity
            )

            if additional_available < 0:
                additional_available = 0

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only {additional_available} additional "
                    f"units available for this resource. "
                    f"Existing allocation: "
                    f"{existing_allocation.quantity}, "
                    f"requested additional quantity: "
                    f"{allocation.quantity}."
                ),
            )

        existing_allocation.quantity = new_total

        db.commit()
        db.refresh(existing_allocation)

        return existing_allocation

    # ---------------------------------------------------------
    # 7. No existing allocation.
    #    Check that the requested quantity is available.
    # ---------------------------------------------------------
    if allocation.quantity > available_stock:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {available_stock} units available "
                f"in warehouse."
            ),
        )

    # ---------------------------------------------------------
    # 8. Create a new allocation
    # ---------------------------------------------------------
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
