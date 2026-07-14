#!/usr/bin/env python3

from pydantic import BaseModel


class StockMonitoringResponse(BaseModel):

    warehouse_id: int
    warehouse: str

    resource_id: int
    resource: str

    current_stock: int
    minimum_stock: int

    status: str

    class Config:
        from_attributes = True
