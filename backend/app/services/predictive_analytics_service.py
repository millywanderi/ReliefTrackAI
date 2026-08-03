#!/usr/bin/env python3

from sqlalchemy.orm import Session

from app.services.forecast_service import forecast_resources
from app.services.stock_monitoring_service import get_current_stock
from app.models.vulnerability_assessment import VulnerabilityAssessment


def get_predictive_analytics(db: Session):

    forecasts = forecast_resources(db)

    inventory = get_current_stock(db)

    critical = (
        db.query(VulnerabilityAssessment)
        .filter(
            VulnerabilityAssessment.priority == "Critical"
        )
        .count()
    )

    if forecasts:
        top_resource = forecasts[0]
    else:
        top_resource = {
            "resource": "N/A",
            "predicted_next_month": 0,
        }

    highest_risk = "None"

    for item in inventory:
        if item["status"] != "NORMAL":
            highest_risk = item["warehouse"]
            break

    recommendation = (
        f"Increase procurement of "
        f"{top_resource['resource']} "
        f"and replenish stock at "
        f"{highest_risk}."
    )

    return {
        "highest_demand_resource":
            top_resource["resource"],

        "predicted_quantity":
            top_resource["predicted_next_month"],

        "highest_risk_warehouse":
            highest_risk,

        "critical_beneficiaries":
            critical,

        "recommendation":
            recommendation,
    }
