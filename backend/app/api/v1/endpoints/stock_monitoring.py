#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.stock_monitoring import (
    StockMonitoringResponse,
)

from app.services import stock_monitoring_service


router = APIRouter(
    prefix="/stock-monitoring",
    tags=["Stock Monitoring"],
)


@router.get(
    "/",
    response_model=list[StockMonitoringResponse],
)
def get_current_stock(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return stock_monitoring_service.get_current_stock(db)
