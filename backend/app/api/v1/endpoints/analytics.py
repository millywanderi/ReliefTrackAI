#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.analytics import (
    TopResourceResponse,
)

from app.services import analytics_service

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


# ----------------------------------------
# TOP DISTRIBUTED RESOURCES
# ----------------------------------------
@router.get(
    "/top-resources",
    response_model=list[TopResourceResponse],
)
def get_top_resources(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_top_resources(db)
