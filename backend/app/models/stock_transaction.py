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


class StockTransaction(Base):
    __tablename__ = "stock_transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id"),
        nullable=False,
    )

    resource_id = Column(
        Integer,
        ForeignKey("resources.id"),
        nullable=False,
    )

    transaction_type = Column(
        String(30),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    reference = Column(
        String(150),
        nullable=True,
    )

    notes = Column(
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
    resource = relationship("Resource")
    user = relationship("User")
