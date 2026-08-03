#!/usr/bin/env python3

from datetime import datetime

from sqlalchemy.orm import Session

from app.services.dashboard_service import get_dashboard
from app.services.forecast_service import forecast_resources
from app.services.fraud_detection_service import detect_fraud
from app.services.predictive_analytics_service import (
    get_predictive_analytics,
)

from app.ai.factory import get_ai_provider

provider = get_ai_provider()

summary = provider.generate_report(
    dashboard,
    top_resource,
    predictive,
    fraud,
)

def generate_executive_report(db: Session):

    dashboard = get_dashboard(db)

    forecasts = forecast_resources(db)

    predictive = get_predictive_analytics(db)

    fraud = detect_fraud(db)

    if forecasts:
        top_resource = forecasts[0]
    else:
        top_resource = {
            "resource": "N/A",
            "predicted_next_month": 0,
        }

    summary = (
        f"ReliefTrack AI analysed the current humanitarian "
        f"operations and found {dashboard['beneficiaries']} "
        f"registered beneficiaries across "
        f"{dashboard['warehouses']} warehouses. "
        f"The highest expected demand next month is "
        f"{top_resource['resource']} "
        f"({top_resource['predicted_next_month']} units). "
        f"There are {len(fraud)} fraud alerts requiring review. "
        f"The highest operational risk warehouse is "
        f"{predictive['highest_risk_warehouse']}. "
        f"{predictive['recommendation']}"
    )

    return {
        "generated_at": datetime.utcnow().isoformat(),

        "dashboard": dashboard,

        "forecast": top_resource,

        "predictive": predictive,

        "fraud_alerts": len(fraud),

        "summary": summary,
    }
