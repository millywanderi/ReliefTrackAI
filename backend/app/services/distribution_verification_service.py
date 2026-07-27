#!/usr/bin/env python3

from fastapi import HTTPException
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

    event = db.query(DistributionEvent).filter(
        DistributionEvent.id == verification.distribution_event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Distribution event not found."
        )

    beneficiary = db.query(Beneficiary).filter(
        Beneficiary.id == verification.beneficiary_id
    ).first()

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Beneficiary not found."
        )

    resource = db.query(Resource).filter(
        Resource.id == verification.resource_id
    ).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found."
        )

    allocation = db.query(
        DistributionResource
    ).filter(
        DistributionResource.distribution_event_id
        == verification.distribution_event_id,
        DistributionResource.resource_id
        == verification.resource_id,
    ).first()

    if not allocation:
        raise HTTPException(
            status_code=400,
            detail="Resource has not been allocated to this distribution."
        )

    if verification.quantity > allocation.quantity:
        raise HTTPException(
            status_code=400,
            detail="Quantity exceeds allocated resources."
        )

    duplicate = db.query(
        DistributionVerification
    ).filter(
        DistributionVerification.distribution_event_id
        == verification.distribution_event_id,
        DistributionVerification.beneficiary_id
        == verification.beneficiary_id,
        DistributionVerification.resource_id
        == verification.resource_id,
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Beneficiary has already received this resource."
        )

    if verification.status not in VALID_STATUS:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification status."
        )

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

    if verification.status == "Delivered":

        stock_out = StockTransaction(
            warehouse_id=event.warehouse_id,
            resource_id=verification.resource_id,
            transaction_type="STOCK_OUT",
            quantity=verification.quantity,
            reference=f"Distribution Event #{event.id}",
            notes=f"Delivered to Beneficiary #{beneficiary.id}",
            created_by=current_user.id,
        )

        db.add(stock_out)

    db.commit()

    db.refresh(delivery)

    return delivery


def get_all_distribution_verifications(db: Session):
    return db.query(
        DistributionVerification
    ).all()


def get_distribution_verification(
    db: Session,
    verification_id: int,
):

    verification = db.query(
        DistributionVerification
    ).filter(
        DistributionVerification.id == verification_id
    ).first()

    if not verification:
        raise HTTPException(
            status_code=404,
            detail="Verification not found."
        )

    return verification
