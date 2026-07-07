#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.household_member import (
    HouseholdMemberCreate,
    HouseholdMemberResponse,
)

from app.services import household_member_service

router = APIRouter(
    prefix="/household-members",
    tags=["Household Members"],
)


@router.post("/", response_model=HouseholdMemberResponse)
def add_member(
    member: HouseholdMemberCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_member_service.add_member(
        db,
        member,
    )


@router.get("/{household_id}")
def get_members(
    household_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_member_service.get_household_members(
        db,
        household_id,
    )


@router.delete("/{member_id}")
def remove_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_member_service.remove_member(
        db,
        member_id,
    )
