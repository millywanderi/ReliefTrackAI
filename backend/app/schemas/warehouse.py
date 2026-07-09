#!/usr/bin/env python3

from datetime import datetime

from pydantic import BaseModel


class WarehouseBase(BaseModel):
    name: str
    county: str

    sub_county: str | None = None
    address: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    capacity: int

    manager_name: str | None = None
    manager_phone: str | None = None

    status: str = "Active"


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: str | None = None
    county: str | None = None

    sub_county: str | None = None
    address: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    capacity: int | None = None

    manager_name: str | None = None
    manager_phone: str | None = None

    status: str | None = None


class WarehouseResponse(WarehouseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
