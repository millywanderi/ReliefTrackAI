#!/usr/bin/env python3

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DistributionResourceBase(BaseModel):
    distribution_event_id: int
    resource_id: int
    quantity: int


class DistributionResourceCreate(DistributionResourceBase):
    pass


class DistributionResourceUpdate(BaseModel):
    quantity: Optional[int] = None


class DistributionResourceResponse(DistributionResourceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
