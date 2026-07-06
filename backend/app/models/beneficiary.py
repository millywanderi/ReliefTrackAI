#!/usr/bin/env python3

from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    gender = Column(String(20), nullable=False)

    date_of_birth = Column(Date, nullable=True)

    national_id = Column(String(50), unique=True, nullable=True)

    phone = Column(String(20), nullable=True)

    county = Column(String(100), nullable=False)
    sub_county = Column(String(100), nullable=True)
    ward = Column(String(100), nullable=True)
    village = Column(String(150), nullable=True)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    registration_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    creator = relationship("User")
