#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.distribution_resource import (
    DistributionResourceCreate,
    DistributionResourceResponse,
)

from app.services import distribution_resource_service

router = APIRouter(
    prefix="/distribution-resources",
    tags=["Distribution Resources"],
)


# ----------------------------------
# CREATE RESOURCE ALLOCATION
# ----------------------------------
@router.post("/", response_model=DistributionResourceResponse)
def create_distribution_resource(
    allocation: DistributionResourceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_resource_service.create_distribution_resource(
        db,
        allocation,
    )


# ----------------------------------
# GET ALL RESOURCE ALLOCATIONS
# ----------------------------------
@router.get("/", response_model=list[DistributionResourceResponse])
def get_all_distribution_resources(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_resource_service.get_all_distribution_resources(db)


# ----------------------------------
# GET SINGLE RESOURCE ALLOCATION
# ----------------------------------
@router.get("/{allocation_id}", response_model=DistributionResourceResponse)
def get_distribution_resource(
    allocation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_resource_service.get_distribution_resource(
        db,
        allocation_id,
    )


# ----------------------------------
# DELETE RESOURCE ALLOCATION
# ----------------------------------
@router.delete("/{allocation_id}")
def delete_distribution_resource(
    allocation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_resource_service.delete_distribution_resource(
        db,
        allocation_id,
    )
