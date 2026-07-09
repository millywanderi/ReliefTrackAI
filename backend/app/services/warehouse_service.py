#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.warehouse import Warehouse


# -------------------------
# CREATE WAREHOUSE
# -------------------------
def create_warehouse(
    db: Session,
    warehouse_data,
):
    existing = db.query(Warehouse).filter(
        Warehouse.name == warehouse_data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Warehouse already exists."
        )

    warehouse = Warehouse(
        name=warehouse_data.name,
        county=warehouse_data.county,
        sub_county=warehouse_data.sub_county,
        address=warehouse_data.address,
        latitude=warehouse_data.latitude,
        longitude=warehouse_data.longitude,
        capacity=warehouse_data.capacity,
        manager_name=warehouse_data.manager_name,
        manager_phone=warehouse_data.manager_phone,
        status=warehouse_data.status,
    )

    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)

    return warehouse


# -------------------------
# GET ALL WAREHOUSES
# -------------------------
def get_all_warehouses(
    db: Session,
    search: str | None = None,
    county: str | None = None,
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
):

    query = db.query(Warehouse)

    if search:
        query = query.filter(
            Warehouse.name.ilike(f"%{search}%")
        )

    if county:
        query = query.filter(
            Warehouse.county.ilike(county.strip())
        )

    if status:
        query = query.filter(
            Warehouse.status.ilike(status.strip())
        )

    warehouses = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return warehouses


# -------------------------
# GET WAREHOUSE
# -------------------------
def get_warehouse(
    db: Session,
    warehouse_id: int
):

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found."
        )

    return warehouse


# -------------------------
# UPDATE WAREHOUSE
# -------------------------
def update_warehouse(
    db: Session,
    warehouse_id: int,
    warehouse_data,
):

    warehouse = get_warehouse(
        db,
        warehouse_id
    )

    updates = warehouse_data.model_dump(
        exclude_unset=True
    )

    if "name" in updates:

        existing = db.query(Warehouse).filter(
            Warehouse.name == updates["name"],
            Warehouse.id != warehouse_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Warehouse name already exists."
            )

    for key, value in updates.items():
        setattr(
            warehouse,
            key,
            value
        )

    db.commit()
    db.refresh(warehouse)

    return warehouse


# -------------------------
# DELETE WAREHOUSE
# -------------------------
def delete_warehouse(
    db: Session,
    warehouse_id: int
):

    warehouse = get_warehouse(
        db,
        warehouse_id
    )

    db.delete(warehouse)
    db.commit()

    return {
        "message": "Warehouse deleted successfully."
    }
