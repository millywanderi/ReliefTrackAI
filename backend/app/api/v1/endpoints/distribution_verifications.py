#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.distribution_verification import (
    DistributionVerificationCreate,
    DistributionVerificationResponse,
)

from app.services import distribution_verification_service

router = APIRouter(
    prefix="/distribution-verifications",
    tags=["Distribution Verifications"],
)


# ----------------------------------------
# CREATE VERIFICATION
# ----------------------------------------
@router.post(
    "/",
    response_model=DistributionVerificationResponse,
)
def create_distribution_verification(
    verification: DistributionVerificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_verification_service.create_distribution_verification(
        db,
        verification,
        current_user,
    )


# ----------------------------------------
# GET ALL VERIFICATIONS
# ----------------------------------------
@router.get(
    "/",
    response_model=list[DistributionVerificationResponse],
)
def get_all_distribution_verifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        distribution_verification_service
        .get_all_distribution_verifications(db)
    )


# ----------------------------------------
# GET SINGLE VERIFICATION
# ----------------------------------------
@router.get(
    "/{verification_id}",
    response_model=DistributionVerificationResponse,
)
def get_distribution_verification(
    verification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        distribution_verification_service
        .get_distribution_verification(
            db,
            verification_id,
        )
    )
