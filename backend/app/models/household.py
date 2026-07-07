#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    func,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class Household(Base):
    __tablename__ = "households"

    id = Column(Integer, primary_key=True, index=True)

    household_code = Column(
        String(50),
        unique=True,
        nullable=False
    )

    household_head_id = Column(
        Integer,
        ForeignKey("beneficiaries.id"),
        nullable=False
    )

    household_size = Column(
        Integer,
        nullable=False,
        default=1
    )

    shelter_type = Column(
        String(100),
        nullable=True
    )

    livelihood = Column(
        String(100),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    household_head = relationship("Beneficiary")
