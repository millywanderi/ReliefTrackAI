#!/usr/bin/env python3

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class DistributionEventBase(BaseModel):
    name: str
    disaster_type: str
    warehouse_id: int
    county: str
    start_date: date
    end_date: date
    status: str = "Planned"
    description: Optional[str] = None


class DistributionEventCreate(DistributionEventBase):
    pass


class DistributionEventUpdate(BaseModel):
    name: Optional[str] = None
    disaster_type: Optional[str] = None
    warehouse_id: Optional[int] = None
    county: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    description: Optional[str] = None


class DistributionEventResponse(DistributionEventBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
