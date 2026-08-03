#!/usr/bin/env python3

from pydantic import BaseModel


class PredictiveAnalyticsResponse(BaseModel):
    highest_demand_resource: str
    predicted_quantity: float

    highest_risk_warehouse: str

    critical_beneficiaries: int

    recommendation: str
