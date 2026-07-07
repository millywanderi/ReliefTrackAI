#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.household import (
    HouseholdCreate,
    HouseholdUpdate,
    HouseholdResponse,
)

from app.services import household_service

router = APIRouter(
    prefix="/households",
    tags=["Households"],
)


@router.post("/", response_model=HouseholdResponse)
def create_household(
    household: HouseholdCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_service.create_household(
        db,
        household,
    )


@router.get("/", response_model=list[HouseholdResponse])
def get_households(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_service.get_all_households(db)


@router.get("/{household_id}", response_model=HouseholdResponse)
def get_household(
    household_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_service.get_household(
        db,
        household_id,
    )


@router.put("/{household_id}", response_model=HouseholdResponse)
def update_household(
    household_id: int,
    household: HouseholdUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_service.update_household(
        db,
        household_id,
        household,
    )


@router.delete("/{household_id}")
def delete_household(
    household_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return household_service.delete_household(
        db,
        household_id,
    )
