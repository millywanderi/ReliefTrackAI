#!/usr/bin/env python3

from datetime import datetime

from pydantic import BaseModel


class ResourceBase(BaseModel):
    name: str
    category: str
    unit: str
    minimum_stock: int = 0
    description: str | None = None


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    unit: str | None = None
    minimum_stock: int | None = None
    description: str | None = None


class ResourceResponse(ResourceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
