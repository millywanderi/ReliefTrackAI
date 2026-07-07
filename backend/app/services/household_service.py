#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.household import Household
from app.models.household_member import HouseholdMember
from app.models.beneficiary import Beneficiary


# -------------------------
# CREATE HOUSEHOLD
# -------------------------
def create_household(
    db: Session,
    household_data
):

    # Check household code
    existing = db.query(Household).filter(
        Household.household_code == household_data.household_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Household code already exists."
        )

    # Check household head exists
    beneficiary = db.query(Beneficiary).filter(
        Beneficiary.id == household_data.household_head_id
    ).first()

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Household head not found."
        )

    # Ensure beneficiary is not already assigned
    existing_member = db.query(HouseholdMember).filter(
        HouseholdMember.beneficiary_id == beneficiary.id
    ).first()

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="This beneficiary already belongs to a household."
        )

    # Create household
    household = Household(
        household_code=household_data.household_code,
        household_head_id=household_data.household_head_id,
        household_size=1,
        shelter_type=household_data.shelter_type,
        livelihood=household_data.livelihood,
    )

    db.add(household)
    db.commit()
    db.refresh(household)

    # Automatically add household head as first member
    head_member = HouseholdMember(
        household_id=household.id,
        beneficiary_id=beneficiary.id,
        relationship_to_head="Head"
    )

    db.add(head_member)
    db.commit()

    return household


# -------------------------
# GET ALL HOUSEHOLDS
# -------------------------
def get_all_households(
    db: Session,
    page: int = 1,
    limit: int = 20,
):

    households = (
        db.query(Household)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return households


# -------------------------
# GET HOUSEHOLD BY ID
# -------------------------
def get_household(
    db: Session,
    household_id: int,
):

    household = db.query(Household).filter(
        Household.id == household_id
    ).first()

    if not household:
        raise HTTPException(
            status_code=404,
            detail="Household not found."
        )

    return household


# -------------------------
# UPDATE HOUSEHOLD
# -------------------------
def update_household(
    db: Session,
    household_id: int,
    household_data
):

    household = get_household(db, household_id)

    updates = household_data.model_dump(exclude_unset=True)

    # Prevent duplicate household codes
    if "household_code" in updates:

        existing = db.query(Household).filter(
            Household.household_code == updates["household_code"],
            Household.id != household_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Household code already exists."
            )

    for key, value in updates.items():
        setattr(household, key, value)

    db.commit()
    db.refresh(household)

    return household


# -------------------------
# DELETE HOUSEHOLD
# -------------------------
def delete_household(
    db: Session,
    household_id: int,
):

    household = get_household(db, household_id)

    # Delete all members first
    db.query(HouseholdMember).filter(
        HouseholdMember.household_id == household_id
    ).delete()

    db.delete(household)
    db.commit()

    return {
        "message": "Household deleted successfully."
    }
