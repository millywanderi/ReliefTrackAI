#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.beneficiary import Beneficiary


def create_beneficiary(db, beneficiary_data, current_user):

    if beneficiary_data.national_id:

        existing = db.query(Beneficiary).filter(
            Beneficiary.national_id == beneficiary_data.national_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Beneficiary with this National ID already exists."
            )

    beneficiary = Beneficiary(
        first_name=beneficiary_data.first_name,
        last_name=beneficiary_data.last_name,
        gender=beneficiary_data.gender,
        date_of_birth=beneficiary_data.date_of_birth,
        national_id=beneficiary_data.national_id,
        phone=beneficiary_data.phone,
        county=beneficiary_data.county,
        sub_county=beneficiary_data.sub_county,
        ward=beneficiary_data.ward,
        village=beneficiary_data.village,
        latitude=beneficiary_data.latitude,
        longitude=beneficiary_data.longitude,
        created_by=current_user.id
    )

    db.add(beneficiary)
    db.commit()
    db.refresh(beneficiary)

    return beneficiary


def get_all_beneficiaries(db: Session):
    return db.query(Beneficiary).all()


def get_beneficiary(db: Session, beneficiary_id: int):

    beneficiary = db.query(Beneficiary).filter(
        Beneficiary.id == beneficiary_id
    ).first()

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Beneficiary not found."
        )

    return beneficiary


def update_beneficiary(
    db: Session,
    beneficiary_id: int,
    beneficiary_data
):

    beneficiary = get_beneficiary(db, beneficiary_id)

    updates = beneficiary_data.model_dump(exclude_unset=True)

    if "national_id" in updates and updates["national_id"]:

        existing = db.query(Beneficiary).filter(
            Beneficiary.national_id == updates["national_id"],
            Beneficiary.id != beneficiary_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Another beneficiary already uses this National ID."
            )

    for key, value in updates.items():
        setattr(beneficiary, key, value)

    db.commit()
    db.refresh(beneficiary)

    return beneficiary


def delete_beneficiary(
    db: Session,
    beneficiary_id: int
):

    beneficiary = get_beneficiary(db, beneficiary_id)

    db.delete(beneficiary)

    db.commit()

    return {
        "message": "Beneficiary deleted successfully."
    }
