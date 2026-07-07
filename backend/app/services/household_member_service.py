#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.household import Household
from app.models.household_member import HouseholdMember
from app.models.beneficiary import Beneficiary


def update_household_size(db: Session, household_id: int):

    total_members = db.query(HouseholdMember).filter(
        HouseholdMember.household_id == household_id
    ).count()

    household = db.query(Household).filter(
        Household.id == household_id
    ).first()

    if household:
        household.household_size = total_members

        db.commit()
        db.refresh(household)


def add_member(db: Session, member_data):

    household = db.query(Household).filter(
        Household.id == member_data.household_id
    ).first()

    if not household:
        raise HTTPException(
            status_code=404,
            detail="Household not found."
        )

    beneficiary = db.query(Beneficiary).filter(
        Beneficiary.id == member_data.beneficiary_id
    ).first()

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Beneficiary not found."
        )

    existing = db.query(HouseholdMember).filter(
        HouseholdMember.beneficiary_id == member_data.beneficiary_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Beneficiary already belongs to another household."
        )

    member = HouseholdMember(
        household_id=member_data.household_id,
        beneficiary_id=member_data.beneficiary_id,
        relationship_to_head=member_data.relationship_to_head,
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    update_household_size(db, member.household_id)

    return member


def get_household_members(
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

    return db.query(HouseholdMember).filter(
        HouseholdMember.household_id == household_id
    ).all()


def remove_member(
    db: Session,
    member_id: int,
):

    member = db.query(HouseholdMember).filter(
        HouseholdMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Household member not found."
        )

    household_id = member.household_id

    db.delete(member)
    db.commit()

    update_household_size(db, household_id)

    return {
        "message": "Member removed successfully."
    }
