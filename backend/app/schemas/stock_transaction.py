#!/usr/bin/env python3

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class StockTransactionBase(BaseModel):
    warehouse_id: int
    resource_id: int
    transaction_type: str
    quantity: int
    reference: Optional[str] = None
    notes: Optional[str] = None


class StockTransactionCreate(StockTransactionBase):
    pass


class StockTransactionUpdate(BaseModel):
    transaction_type: Optional[str] = None
    quantity: Optional[int] = None
    reference: Optional[str] = None
    notes: Optional[str] = None


class StockTransactionResponse(StockTransactionBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
