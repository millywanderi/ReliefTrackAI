#!/usr/bin/env python3

from pydantic import BaseModel


class HouseholdCreate(BaseModel):

    household_code: str
    household_head_id: int
    household_size: int

    shelter_type: str | None = None
    livelihood: str | None = None


class HouseholdUpdate(BaseModel):

    household_size: int | None = None
    shelter_type: str | None = None
    livelihood: str | None = None


class HouseholdResponse(BaseModel):

    id: int
    household_code: str
    household_head_id: int
    household_size: int

    shelter_type: str | None = None
    livelihood: str | None = None

    class Config:
        from_attributes = True
