#!/usr/bin/env python3

from pydantic import BaseModel


class DashboardResponse(BaseModel):

    beneficiaries: int
    households: int

    warehouses: int
    resources: int

    distribution_events: int

    resources_distributed: int

    low_stock_alerts: int

    critical_beneficiaries: int
