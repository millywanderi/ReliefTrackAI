#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.distribution_event import DistributionEvent
from app.models.warehouse import Warehouse


VALID_STATUS = {
    "Planned",
    "In Progress",
    "Completed",
    "Cancelled",
}


def create_distribution_event(
    db: Session,
    event_data,
    current_user,
):

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == event_data.warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found."
        )

    if event_data.status not in VALID_STATUS:
        raise HTTPException(
            status_code=400,
            detail="Invalid status."
        )

    event = DistributionEvent(
        name=event_data.name,
        disaster_type=event_data.disaster_type,
        warehouse_id=event_data.warehouse_id,
        county=event_data.county,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        status=event_data.status,
        description=event_data.description,
        created_by=current_user.id,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_all_distribution_events(
    db: Session,
    status: str | None = None,
):

    query = db.query(DistributionEvent)

    if status:
        query = query.filter(
            DistributionEvent.status == status
        )

    return query.all()


def get_distribution_event(
    db: Session,
    event_id: int,
):

    event = db.query(DistributionEvent).filter(
        DistributionEvent.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Distribution event not found."
        )

    return event


def update_distribution_event(
    db: Session,
    event_id: int,
    event_data,
):

    event = get_distribution_event(
        db,
        event_id,
    )

    updates = event_data.model_dump(
        exclude_unset=True
    )

    if (
        "warehouse_id" in updates
        and updates["warehouse_id"] is not None
    ):

        warehouse = db.query(Warehouse).filter(
            Warehouse.id == updates["warehouse_id"]
        ).first()

        if not warehouse:
            raise HTTPException(
                status_code=404,
                detail="Warehouse not found."
            )

    if (
        "status" in updates
        and updates["status"] not in VALID_STATUS
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid status."
        )

    for key, value in updates.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


def delete_distribution_event(
    db: Session,
    event_id: int,
):

    event = get_distribution_event(
        db,
        event_id,
    )

    db.delete(event)
    db.commit()

    return {
        "message": "Distribution event deleted successfully."
    }
