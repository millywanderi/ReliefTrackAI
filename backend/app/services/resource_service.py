#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.resource import Resource


# -------------------------
# CREATE RESOURCE
# -------------------------
def create_resource(
    db: Session,
    resource_data,
):

    existing = db.query(Resource).filter(
        Resource.name == resource_data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Resource already exists."
        )

    resource = Resource(
        name=resource_data.name,
        category=resource_data.category,
        unit=resource_data.unit,
        minimum_stock=resource_data.minimum_stock,
        description=resource_data.description,
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


# -------------------------
# GET ALL RESOURCES
# -------------------------
def get_all_resources(
    db: Session,
    search: str | None = None,
    category: str | None = None,
    page: int = 1,
    limit: int = 20,
):

    query = db.query(Resource)

    if search:
        query = query.filter(
            Resource.name.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(
            Resource.category.ilike(category.strip())
        )

    return (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


# -------------------------
# GET RESOURCE
# -------------------------
def get_resource(
    db: Session,
    resource_id: int,
):

    resource = db.query(Resource).filter(
        Resource.id == resource_id
    ).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found."
        )

    return resource


# -------------------------
# UPDATE RESOURCE
# -------------------------
def update_resource(
    db: Session,
    resource_id: int,
    resource_data,
):

    resource = get_resource(db, resource_id)

    updates = resource_data.model_dump(exclude_unset=True)

    if "name" in updates:

        existing = db.query(Resource).filter(
            Resource.name == updates["name"],
            Resource.id != resource_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Resource already exists."
            )

    for key, value in updates.items():
        setattr(resource, key, value)

    db.commit()
    db.refresh(resource)

    return resource


# -------------------------
# DELETE RESOURCE
# -------------------------
def delete_resource(
    db: Session,
    resource_id: int,
):

    resource = get_resource(db, resource_id)

    db.delete(resource)
    db.commit()

    return {
        "message": "Resource deleted successfully."
    }
