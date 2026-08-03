#!/usr/bin/env python3

from pydantic import BaseModel


class ResourceForecastResponse(BaseModel):
    resource: str
    historical_total: int
    months_observed: int
    monthly_average: float
    growth_factor: float
    predicted_next_month: float
    recommendation: str
