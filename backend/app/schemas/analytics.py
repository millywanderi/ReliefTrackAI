#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.analytics import (
    TopResourceResponse,
    TopCountyResponse,
    WarehouseUtilizationResponse,
    LowStockResponse,
    DistributionTrendResponse,
)

from app.services import analytics_service

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/top-resources",
    response_model=list[TopResourceResponse],
)
def top_resources(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_top_resources(db)


@router.get(
    "/top-counties",
    response_model=list[TopCountyResponse],
)
def top_counties(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_top_counties(db)


@router.get(
    "/warehouse-utilization",
    response_model=list[WarehouseUtilizationResponse],
)
def warehouse_utilization(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_warehouse_utilization(db)


@router.get(
    "/distribution-trends",
    response_model=list[DistributionTrendResponse],
)
def distribution_trends(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_distribution_trends(db)


@router.get(
    "/low-stock-report",
    response_model=list[LowStockResponse],
)
def low_stock_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analytics_service.get_low_stock_report(db)
