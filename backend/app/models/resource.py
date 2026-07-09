#!/usr/bin/env python3

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
)
from sqlalchemy.sql import func

from app.core.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
        unique=True,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    unit = Column(
        String(50),
        nullable=False,
    )

    minimum_stock = Column(
        Integer,
        nullable=False,
        default=0,
    )

    description = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
