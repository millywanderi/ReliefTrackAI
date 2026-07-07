#!/usr/bin/env python3

from pydantic import BaseModel


class HouseholdMemberCreate(BaseModel):

    household_id: int
    beneficiary_id: int
    relationship_to_head: str


class HouseholdMemberResponse(BaseModel):

    id: int
    household_id: int
    beneficiary_id: int
    relationship_to_head: str

    class Config:
        from_attributes = True
