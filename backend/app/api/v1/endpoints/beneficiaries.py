#!/usr/bin/env python3

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.models.beneficiary import Beneficiary
from app.schemas.beneficiary import (
    BeneficiaryCreate,
    BeneficiaryResponse,
)

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
    db: Session =Depends(get_db),
    current_user=Depends(get_current_user)
):

    existing = db.query(Beneficiary).filter(
        Beneficiary.national_id == beneficiary.national_id
    ).first()

    if existing and beneficiary.national_id:
        raise HTTPException(
            status_code=400,
            detail="Beneficiary already exists."
        )

    new_beneficiary = Beneficiary(
        first_name=beneficiary.first_name,
        last_name=beneficiary.last_name,
        gender=beneficiary.gender,
        date_of_birth=beneficiary.date_of_birth,
        national_id=beneficiary.national_id,
        phone=beneficiary.phone,
        county=beneficiary.county,
        sub_county=beneficiary.sub_county,
        ward=beneficiary.ward,
        village=beneficiary.village,
        latitude=beneficiary.latitude,
        longitude=beneficiary.longitude,
        created_by=current_user.id
    )

    db.add(new_beneficiary)
    db.commit()
    db.refresh(new_beneficiary)

    return new_beneficiary


# -------------------------
# GET ALL BENEFICIARIES
# -------------------------
@router.get("/", response_model=list[BeneficiaryResponse])
def get_beneficiaries(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    beneficiaries = db.query(Beneficiary).all()

    return beneficiaries


# -------------------------
# GET BENEFICIARY BY ID
# -------------------------
@router.get("/{beneficiary_id}", response_model=BeneficiaryResponse)
def get_beneficiary(
    beneficiary_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    beneficiary = db.query(Beneficiary).filter(
        Beneficiary.id == beneficiary_id
    ).first()

    if not beneficiary:
        raise HTTPException(
            status_code=404,
            detail="Beneficiary not found."
        )

    return beneficiary
