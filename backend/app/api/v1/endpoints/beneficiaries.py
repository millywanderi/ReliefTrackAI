#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/beneficiaries",
    tags=["Beneficiaries"]
)


from app.models.beneficiary import Beneficiary
from app.schemas.beneficiary import (
    BeneficiaryCreate,
    BeneficiaryResponse
)


@router.post("/", response_model=BeneficiaryResponse)
def create_beneficiary(
    beneficiary: BeneficiaryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

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
