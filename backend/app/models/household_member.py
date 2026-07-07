#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class HouseholdMember(Base):
    __tablename__ = "household_members"

    id = Column(Integer, primary_key=True, index=True)

    household_id = Column(
        Integer,
        ForeignKey("households.id"),
        nullable=False
    )

    beneficiary_id = Column(
        Integer,
        ForeignKey("beneficiaries.id"),
        nullable=False,
        unique=True
    )

    relationship_to_head = Column(
        String(100),
        nullable=False
    )

    household = relationship("Household")

    beneficiary = relationship("Beneficiary")
