#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.core.database import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(150),
        nullable=False,
        unique=True,
    )

    county = Column(
        String(100),
        nullable=False,
    )

    sub_county = Column(
        String(100),
        nullable=True,
    )

    address = Column(
        String(255),
        nullable=True,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    capacity = Column(
        Integer,
        nullable=False,
        default=0,
    )

    manager_name = Column(
        String(100),
        nullable=True,
    )

    manager_phone = Column(
        String(30),
        nullable=True,
    )

    status = Column(
        String(30),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
