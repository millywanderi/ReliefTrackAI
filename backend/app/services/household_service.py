#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.household import Household
from app.models.beneficiary import Beneficiary


def create_household(db: Session, household_data):

    existing = db.query(Household).filter(
        Household.household_code == household_data.household_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Household code already exists."
        )

    head = db.query(Beneficiary).filter(
        Beneficiary.id == household_data.household_head_id
    ).first()

    if not head:
        raise HTTPException(
            status_code=404,
            detail="Household head not found."
        )

    household = Household(
        household_code=household_data.household_code,
        household_head_id=household_data.household_head_id,
        household_size=household_data.household_size,
        shelter_type=household_data.shelter_type,
        livelihood=household_data.livelihood,
    )

    db.add(household)
    db.commit()
    db.refresh(household)

    return household


def get_all_households(db: Session):

    return db.query(Household).all()


def get_household(db: Session, household_id: int):

    household = db.query(Household).filter(
        Household.id == household_id
    ).first()

    if not household:
        raise HTTPException(
            status_code=404,
            detail="Household not found."
        )

    return household


def update_household(
    db: Session,
    household_id: int,
    household_data,
):

    household = get_household(db, household_id)

    updates = household_data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(household, key, value)

    db.commit()
    db.refresh(household)

    return household


def delete_household(
    db: Session,
    household_id: int,
):

    household = get_household(db, household_id)

    db.delete(household)
    db.commit()

    return {
        "message": "Household deleted successfully."
    }
