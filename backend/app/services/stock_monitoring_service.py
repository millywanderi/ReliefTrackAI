#!/usr/bin/env python3

from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.stock_transaction import StockTransaction
from app.models.warehouse import Warehouse
from app.models.resource import Resource


def get_current_stock(db: Session):

    stock = (
        db.query(
            Warehouse.id.label("warehouse_id"),
            Warehouse.name.label("warehouse"),
            Resource.id.label("resource_id"),
            Resource.name.label("resource"),
            func.sum(
                case(
                    (
                        StockTransaction.transaction_type.in_(
                            [
                                "STOCK_IN",
                                "TRANSFER_IN",
                                "ADJUSTMENT",
                            ]
                        ),
                        StockTransaction.quantity,
                    ),
                    else_=-StockTransaction.quantity,
                )
            ).label("current_stock"),
        )
        .join(
            Warehouse,
            Warehouse.id == StockTransaction.warehouse_id,
        )
        .join(
            Resource,
            Resource.id == StockTransaction.resource_id,
        )
        .group_by(
            Warehouse.id,
            Warehouse.name,
            Resource.id,
            Resource.name,
        )
        .all()
    )

    return stock
