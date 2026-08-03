#!/usr/bin/env python3

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.models.distribution_event import DistributionEvent
from app.models.distribution_verification import DistributionVerification
from app.models.warehouse import Warehouse
from app.models.stock_transaction import StockTransaction


def get_top_resources(db: Session):
    results = (
        db.query(
            Resource.name.label("resource"),
            func.sum(
                DistributionVerification.quantity
            ).label("total_distributed"),
        )
        .join(
            DistributionVerification,
            DistributionVerification.resource_id == Resource.id,
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .group_by(Resource.name)
        .order_by(
            func.sum(
                DistributionVerification.quantity
            ).desc()
        )
        .all()
    )

    return [
        {
            "resource": row.resource,
            "total_distributed": row.total_distributed,
        }
        for row in results
    ]


def get_top_counties(db: Session):
    results = (
        db.query(
            DistributionEvent.county,
            func.sum(
                DistributionVerification.quantity
            ).label("total_distributed"),
        )
        .join(
            DistributionVerification,
            DistributionVerification.distribution_event_id
            == DistributionEvent.id,
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .group_by(DistributionEvent.county)
        .order_by(
            func.sum(
                DistributionVerification.quantity
            ).desc()
        )
        .all()
    )

    return [
        {
            "county": row.county,
            "total_distributed": row.total_distributed,
        }
        for row in results
    ]


def get_warehouse_utilization(db: Session):
    results = (
        db.query(
            Warehouse.name.label("warehouse"),
            func.sum(
                DistributionVerification.quantity
            ).label("total_distributed"),
        )
        .join(
            DistributionEvent,
            DistributionEvent.warehouse_id == Warehouse.id,
        )
        .join(
            DistributionVerification,
            DistributionVerification.distribution_event_id
            == DistributionEvent.id,
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .group_by(Warehouse.name)
        .order_by(
            func.sum(
                DistributionVerification.quantity
            ).desc()
        )
        .all()
    )

    return [
        {
            "warehouse": row.warehouse,
            "total_distributed": row.total_distributed,
        }
        for row in results
    ]


def get_distribution_trends(db: Session):
    results = (
        db.query(
            func.to_char(
                DistributionVerification.verification_date,
                "YYYY-MM"
            ).label("month"),
            func.sum(
                DistributionVerification.quantity
            ).label("total_distributed"),
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    return [
        {
            "month": row.month,
            "total_distributed": row.total_distributed,
        }
        for row in results
    ]


def get_low_stock_report(db: Session):

    resources = db.query(Resource).all()

    report = []

    for resource in resources:

        stock = (
            db.query(
                func.sum(
                    StockTransaction.quantity
                )
            )
            .filter(
                StockTransaction.resource_id == resource.id
            )
            .scalar()
        ) or 0

        minimum = getattr(resource, "minimum_stock", 100)

        status = "NORMAL"

        if stock <= minimum:
            status = "LOW"

        report.append(
            {
                "warehouse": "All Warehouses",
                "resource": resource.name,
                "available": stock,
                "minimum": minimum,
                "status": status,
            }
        )

    report.sort(
        key=lambda x: x["available"]
    )

    return report
