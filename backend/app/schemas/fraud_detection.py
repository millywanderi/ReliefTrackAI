#!/usr/bin/env python3

from pydantic import BaseModel


class FraudAlertResponse(BaseModel):
    rule: str
    severity: str
    description: str
