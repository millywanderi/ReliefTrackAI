#!/usr/bin/env python3

from pydantic import BaseModel


class AIExecutiveReportResponse(BaseModel):
    generated_at: str
    dashboard: dict
    forecast: dict
    predictive: dict
    fraud_alerts: int
    summary: str
