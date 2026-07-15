#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class DistributionResource(Base):
    __tablename__ = "distribution_resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    distribution_event_id = Column(
        Integer,
        ForeignKey("distribution_events.id"),
        nullable=False,
    )

    resource_id = Column(
        Integer,
        ForeignKey("resources.id"),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    distribution_event = relationship("DistributionEvent")
    resource = relationship("Resource")
