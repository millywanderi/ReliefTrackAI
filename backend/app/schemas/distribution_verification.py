#!/usr/bin/env python3

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DistributionVerificationBase(BaseModel):
    distribution_event_id: int
    beneficiary_id: int
    resource_id: int
    quantity: int
    status: str = "Delivered"
    notes: Optional[str] = None


class DistributionVerificationCreate(DistributionVerificationBase):
    pass


class DistributionVerificationResponse(DistributionVerificationBase):
    id: int
    verified_by: int
    verification_date: datetime

    class Config:
        from_attributes = True
