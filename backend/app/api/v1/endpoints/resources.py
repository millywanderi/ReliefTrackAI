#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
)

from app.services import resource_service

router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


# -------------------------
# CREATE RESOURCE
# -------------------------
@router.post("/", response_model=ResourceResponse)
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return resource_service.create_resource(
        db,
        resource,
    )


# -------------------------
# GET ALL RESOURCES
# -------------------------
@router.get("/", response_model=list[ResourceResponse])
def get_all_resources(
    search: str | None = None,
    category: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return resource_service.get_all_resources(
        db=db,
        search=search,
        category=category,
        page=page,
        limit=limit,
    )


# -------------------------
# GET RESOURCE BY ID
# -------------------------
@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return resource_service.get_resource(
        db,
        resource_id,
    )


# -------------------------
# UPDATE RESOURCE
# -------------------------
@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: int,
    resource: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return resource_service.update_resource(
        db,
        resource_id,
        resource,
    )


# -------------------------
# DELETE RESOURCE
# -------------------------
@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return resource_service.delete_resource(
        db,
        resource_id,
    )
