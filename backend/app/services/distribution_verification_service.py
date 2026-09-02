#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.beneficiary import Beneficiary
from app.models.distribution_event import DistributionEvent
from app.models.distribution_resource import DistributionResource
from app.models.distribution_verification import DistributionVerification
from app.models.resource import Resource
from app.models.stock_transaction import StockTransaction


VALID_STATUS = {
    "Pending",
    "Delivered",
    "Failed",
}


def create_distribution_verification(
    db: Session,
    verification,
    current_user,
):
    # ---------------------------------------------------------
    # 1. Check distribution event
    # ---------------------------------------------------------
    event = (
        db.query(DistributionEvent)
        .filter(
            DistributionEvent.id
            == verification.distribution_event_id
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Distribution event not found.",
        )

    # ---------------------------------------------------------
    # 2. Check beneficiary
    # ---------------------------------------------------------
    beneficiary = (
        db.query(Beneficiary)
        .filter(
            Beneficiary.id
            == verification.beneficiary_id
        )
        .first()
    )

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Beneficiary not found.",
        )

    # ---------------------------------------------------------
    # 3. Check resource
    # ---------------------------------------------------------
    resource = (
        db.query(Resource)
        .filter(
            Resource.id == verification.resource_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found.",
        )

    # ---------------------------------------------------------
    # 4. Validate status
    # ---------------------------------------------------------
    if verification.status not in VALID_STATUS:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification status.",
        )

    # ---------------------------------------------------------
    # 5. Validate quantity
    # ---------------------------------------------------------
    if verification.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Verification quantity must be "
                "greater than zero."
            ),
        )

    # ---------------------------------------------------------
    # 6. Find allocation
    # ---------------------------------------------------------
    allocation = (
        db.query(DistributionResource)
        .filter(
            DistributionResource.distribution_event_id
            == verification.distribution_event_id,
            DistributionResource.resource_id
            == verification.resource_id,
        )
        .first()
    )

    if not allocation:
        raise HTTPException(
            status_code=400,
            detail=(
                "Resource has not been allocated "
                "to this distribution."
            ),
        )

    # ---------------------------------------------------------
    # 7. Prevent duplicate beneficiary/resource verification
    # ---------------------------------------------------------
    duplicate = (
        db.query(DistributionVerification)
        .filter(
            DistributionVerification.distribution_event_id
            == verification.distribution_event_id,
            DistributionVerification.beneficiary_id
            == verification.beneficiary_id,
            DistributionVerification.resource_id
            == verification.resource_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail=(
                "Beneficiary has already received "
                "this resource."
            ),
        )

    # ---------------------------------------------------------
    # 8. Calculate quantity already delivered.
    #
    # Pending and Failed records do not consume allocation.
    # ---------------------------------------------------------
    delivered_quantity = (
        db.query(
            func.sum(
                DistributionVerification.quantity
            )
        )
        .filter(
            DistributionVerification.distribution_event_id
            == verification.distribution_event_id,
            DistributionVerification.resource_id
            == verification.resource_id,
            DistributionVerification.status
            == "Delivered",
        )
        .scalar()
        or 0
    )

    remaining_allocation = (
        allocation.quantity
        - delivered_quantity
    )

    # ---------------------------------------------------------
    # 9. Only Delivered records consume allocation.
    # ---------------------------------------------------------
    if verification.status == "Delivered":

        if verification.quantity > remaining_allocation:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only {remaining_allocation} units "
                    f"remain available from the allocation. "
                    f"Allocated: {allocation.quantity}, "
                    f"already delivered: "
                    f"{delivered_quantity}, "
                    f"requested: {verification.quantity}."
                ),
            )

        # -----------------------------------------------------
        # 10. Make sure physical stock is still sufficient.
        # -----------------------------------------------------
        current_stock = (
            db.query(
                func.sum(
                    func.case(
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
                StockTransaction.warehouse_id
                == event.warehouse_id,
                StockTransaction.resource_id
                == verification.resource_id,
            )
            .scalar()
            or 0
        )

        if verification.quantity > current_stock:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only {current_stock} units are "
                    f"currently available in the warehouse."
                ),
            )

    # ---------------------------------------------------------
    # 11. Create verification record
    # ---------------------------------------------------------
    delivery = DistributionVerification(
        distribution_event_id=verification.distribution_event_id,
        beneficiary_id=verification.beneficiary_id,
        resource_id=verification.resource_id,
        quantity=verification.quantity,
        status=verification.status,
        notes=verification.notes,
        verified_by=current_user.id,
    )

    db.add(delivery)

    # ---------------------------------------------------------
    # 12. Delivered = STOCK_OUT
    # ---------------------------------------------------------
    if verification.status == "Delivered":

        stock_out = StockTransaction(
            warehouse_id=event.warehouse_id,
            resource_id=verification.resource_id,
            transaction_type="STOCK_OUT",
            quantity=verification.quantity,
            reference=(
                f"Distribution Event #{event.id}"
            ),
            notes=(
                f"Delivered to Beneficiary "
                f"#{beneficiary.id}"
            ),
            created_by=current_user.id,
        )

        db.add(stock_out)

    db.commit()

    db.refresh(delivery)

    return delivery


def get_all_distribution_verifications(db: Session):
    return (
        db.query(
            DistributionVerification
        )
        .all()
    )


def get_distribution_verification(
    db: Session,
    verification_id: int,
):
    verification = (
        db.query(
            DistributionVerification
        )
        .filter(
            DistributionVerification.id
            == verification_id
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=404,
            detail="Verification not found.",
        )

    return verification
