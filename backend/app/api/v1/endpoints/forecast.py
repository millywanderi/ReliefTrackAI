#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.forecast import (
    ResourceForecastResponse,
)

from app.services import forecast_service

router = APIRouter(
    prefix="/forecast",
    tags=["AI Demand Forecasting"],
)


@router.get(
    "/resources",
    response_model=list[ResourceForecastResponse],
)
def forecast_resources(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return forecast_service.forecast_resources(db)
