#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class DistributionEvent(Base):
    __tablename__ = "distribution_events"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    disaster_type = Column(
        String(100),
        nullable=False,
    )

    warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id"),
        nullable=False,
    )

    county = Column(
        String(100),
        nullable=False,
    )

    start_date = Column(
        Date,
        nullable=False,
    )

    end_date = Column(
        Date,
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="Planned",
    )

    description = Column(
        String(500),
        nullable=True,
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    warehouse = relationship("Warehouse")
    user = relationship("User")
