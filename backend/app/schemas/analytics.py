#!/usr/bin/env python3

from pydantic import BaseModel


class TopResourceResponse(BaseModel):
    resource: str
    total_distributed: int


class TopCountyResponse(BaseModel):
    county: str
    total_distributed: int


class WarehouseUtilizationResponse(BaseModel):
    warehouse: str
    total_distributed: int


class LowStockResponse(BaseModel):
    warehouse: str
    resource: str
    available: int
    minimum: int
    status: str


class DistributionTrendResponse(BaseModel):
    month: str
    total_distributed: int
