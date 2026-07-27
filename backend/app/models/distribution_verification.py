#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class DistributionVerification(Base):
    __tablename__ = "distribution_verifications"

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

    beneficiary_id = Column(
        Integer,
        ForeignKey("beneficiaries.id"),
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

    status = Column(
        String(30),
        nullable=False,
        default="Pending",
    )

    notes = Column(
        String(500),
        nullable=True,
    )

    verified_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    verification_date = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    distribution_event = relationship("DistributionEvent")
    beneficiary = relationship("Beneficiary")
    resource = relationship("Resource")
    user = relationship("User")
