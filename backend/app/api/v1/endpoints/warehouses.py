#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseUpdate,
    WarehouseResponse,
)

from app.services import warehouse_service

router = APIRouter(
    prefix="/warehouses",
    tags=["Warehouses"]
)


# -------------------------
# CREATE WAREHOUSE
# -------------------------
@router.post("/", response_model=WarehouseResponse)
def create_warehouse(
    warehouse: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return warehouse_service.create_warehouse(
        db,
        warehouse,
    )


# -------------------------
# GET ALL WAREHOUSES
# -------------------------
@router.get("/", response_model=list[WarehouseResponse])
def get_all_warehouses(
    search: str | None = None,
    county: str | None = None,
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return warehouse_service.get_all_warehouses(
        db=db,
        search=search,
        county=county,
        status=status,
        page=page,
        limit=limit,
    )


# -------------------------
# GET WAREHOUSE
# -------------------------
@router.get("/{warehouse_id}", response_model=WarehouseResponse)
def get_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return warehouse_service.get_warehouse(
        db,
        warehouse_id,
    )


# -------------------------
# UPDATE WAREHOUSE
# -------------------------
@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update_warehouse(
    warehouse_id: int,
    warehouse: WarehouseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return warehouse_service.update_warehouse(
        db,
        warehouse_id,
        warehouse,
    )


# -------------------------
# DELETE WAREHOUSE
# -------------------------
@router.delete("/{warehouse_id}")
def delete_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return warehouse_service.delete_warehouse(
        db,
        warehouse_id,
    )
