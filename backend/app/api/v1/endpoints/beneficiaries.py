#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.beneficiary import (
    BeneficiaryCreate,
    BeneficiaryUpdate,
    BeneficiaryResponse,
)

from app.services import beneficiary_service

router = APIRouter(
    prefix="/beneficiaries",
    tags=["Beneficiaries"]
)


# -------------------------
# CREATE BENEFICIARY
# -------------------------
@router.post("/", response_model=BeneficiaryResponse)
def create_beneficiary(
    beneficiary: BeneficiaryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return beneficiary_service.create_beneficiary(
        db,
        beneficiary,
        current_user
    )


# -------------------------
# GET ALL BENEFICIARIES
# -------------------------
@router.get("/", response_model=list[BeneficiaryResponse])
def get_all_beneficiaries(
    search: str | None = None,
    county: str | None = None,
    gender: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return beneficiary_service.get_all_beneficiaries(
        db=db,
        search=search,
        county=county,
        gender=gender,
        page=page,
        limit=limit,
    )


# -------------------------
# GET BENEFICIARY
# -------------------------
@router.get("/{beneficiary_id}", response_model=BeneficiaryResponse)
def get_beneficiary(
    beneficiary_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return beneficiary_service.get_beneficiary(
        db,
        beneficiary_id
    )


# -------------------------
# UPDATE BENEFICIARY
# -------------------------
@router.put("/{beneficiary_id}", response_model=BeneficiaryResponse)
def update_beneficiary(
    beneficiary_id: int,
    beneficiary: BeneficiaryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return beneficiary_service.update_beneficiary(
        db,
        beneficiary_id,
        beneficiary
    )


# -------------------------
# DELETE BENEFICIARY
# -------------------------
@router.delete("/{beneficiary_id}")
def delete_beneficiary(
    beneficiary_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return beneficiary_service.delete_beneficiary(
        db,
        beneficiary_id
    )
