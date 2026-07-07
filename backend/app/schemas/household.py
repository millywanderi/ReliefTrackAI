#!/usr/bin/env python3

from pydantic import BaseModel


# -------------------------
# CREATE HOUSEHOLD
# -------------------------
class HouseholdCreate(BaseModel):
    household_code: str
    household_head_id: int
    shelter_type: str | None = None
    livelihood: str | None = None


# -------------------------
# UPDATE HOUSEHOLD
# -------------------------
class HouseholdUpdate(BaseModel):
    household_code: str | None = None
    household_head_id: int | None = None
    shelter_type: str | None = None
    livelihood: str | None = None


# -------------------------
# RESPONSE
# -------------------------
class HouseholdResponse(BaseModel):
    id: int
    household_code: str
    household_head_id: int
    household_size: int
    shelter_type: str | None = None
    livelihood: str | None = None

    class Config:
        from_attributes = True
