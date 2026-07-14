#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.distribution_event import (
    DistributionEventCreate,
    DistributionEventUpdate,
    DistributionEventResponse,
)

from app.services import distribution_event_service

router = APIRouter(
    prefix="/distribution-events",
    tags=["Distribution Events"],
)


# ----------------------------------
# CREATE DISTRIBUTION EVENT
# ----------------------------------
@router.post("/", response_model=DistributionEventResponse)
def create_distribution_event(
    event: DistributionEventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_event_service.create_distribution_event(
        db,
        event,
        current_user,
    )


# ----------------------------------
# GET ALL DISTRIBUTION EVENTS
# ----------------------------------
@router.get("/", response_model=list[DistributionEventResponse])
def get_all_distribution_events(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_event_service.get_all_distribution_events(
        db,
        status,
    )


# ----------------------------------
# GET SINGLE DISTRIBUTION EVENT
# ----------------------------------
@router.get("/{event_id}", response_model=DistributionEventResponse)
def get_distribution_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_event_service.get_distribution_event(
        db,
        event_id,
    )


# ----------------------------------
# UPDATE DISTRIBUTION EVENT
# ----------------------------------
@router.put("/{event_id}", response_model=DistributionEventResponse)
def update_distribution_event(
    event_id: int,
    event: DistributionEventUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_event_service.update_distribution_event(
        db,
        event_id,
        event,
    )


# ----------------------------------
# DELETE DISTRIBUTION EVENT
# ----------------------------------
@router.delete("/{event_id}")
def delete_distribution_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return distribution_event_service.delete_distribution_event(
        db,
        event_id,
    )
