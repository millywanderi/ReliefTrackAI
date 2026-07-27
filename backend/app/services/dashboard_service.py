#!/usr/bin/env python3

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.beneficiary import Beneficiary
from app.models.household import Household
from app.models.warehouse import Warehouse
from app.models.resource import Resource
from app.models.distribution_event import DistributionEvent
from app.models.distribution_verification import DistributionVerification
from app.models.vulnerability_assessment import VulnerabilityAssessment
from app.services.stock_monitoring_service import get_current_stock


def get_dashboard(db: Session):

    beneficiaries = db.query(
        Beneficiary
    ).count()

    households = db.query(
        Household
    ).count()

    warehouses = db.query(
        Warehouse
    ).count()

    resources = db.query(
        Resource
    ).count()

    distribution_events = db.query(
        DistributionEvent
    ).count()

    resources_distributed = (
        db.query(
            func.coalesce(
                func.sum(
                    DistributionVerification.quantity
                ),
                0,
            )
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .scalar()
    )

    critical_beneficiaries = (
        db.query(
            VulnerabilityAssessment
        )
        .filter(
            VulnerabilityAssessment.priority == "Critical"
        )
        .count()
    )

    inventory = get_current_stock(db)

    low_stock_alerts = sum(
        1
        for item in inventory
        if item["status"] != "NORMAL"
    )

    return {
        "beneficiaries": beneficiaries,
        "households": households,
        "warehouses": warehouses,
        "resources": resources,
        "distribution_events": distribution_events,
        "resources_distributed": resources_distributed,
        "low_stock_alerts": low_stock_alerts,
        "critical_beneficiaries": critical_beneficiaries,
    }
