#!/usr/bin/env python3

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.services.dashboard_service import get_dashboard
from app.services.forecast_service import forecast_resources
from app.services.fraud_detection_service import detect_fraud
from app.services.predictive_analytics_service import (
    get_predictive_analytics,
)

from app.ai.factory import get_ai_provider


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

    provider = get_ai_provider()

    summary = provider.generate_report(
        dashboard,
        top_resource,
        predictive,
        fraud,
    )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),

        "dashboard": dashboard,

        "forecast": top_resource,

        "predictive": predictive,

        "fraud_alerts": len(fraud),

        "summary": summary,
    }
