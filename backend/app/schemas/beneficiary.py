#!/usr/bin/env python3

from datetime import date

from pydantic import BaseModel


class BeneficiaryBase(BaseModel):
    first_name: str
    last_name: str
    gender: str

    date_of_birth: date | None = None

    national_id: str | None = None
    phone: str |None = None

    county: str
    sub_county: str | None = None
    ward: str | None = None
    village: str | None = None

    latitude: float | None = None
    longitude: float | None = None


class BeneficiaryCreate(BeneficiaryBase):
    pass


class BeneficiaryUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    gender: str | None = None

    date_of_birth: date | None = None

    national_id: str | None = None
    phone: str | None = None

    county: str | None = None
    sub_county: str | None = None
    ward: str | None = None
    village: str | None = None

    latitude: float | None = None
    longitude: float | None = None


class BeneficiaryResponse(BeneficiaryBase):
    id: int

    class Config:
        from_attributes = True
