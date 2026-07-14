#!/usr/bin/env python3

from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.stock_transaction import StockTransaction
from app.models.warehouse import Warehouse
from app.models.resource import Resource


def get_current_stock(db: Session):

    current_stock = func.sum(
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
    )

    results = (
        db.query(
            Warehouse.id.label("warehouse_id"),
            Warehouse.name.label("warehouse"),
            Resource.id.label("resource_id"),
            Resource.name.label("resource"),
            Resource.minimum_stock.label("minimum_stock"),
            current_stock.label("current_stock"),
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
            Resource.minimum_stock,
        )
        .all()
    )

    inventory = []

    for row in results:

        stock = row.current_stock or 0

        if stock <= 0:
            status = "OUT OF STOCK"

        elif stock < row.minimum_stock:
            status = "LOW STOCK"

        else:
            status = "NORMAL"

        inventory.append(
            {
                "warehouse_id": row.warehouse_id,
                "warehouse": row.warehouse,
                "resource_id": row.resource_id,
                "resource": row.resource,
                "current_stock": stock,
                "minimum_stock": row.minimum_stock,
                "status": status,
            }
        )

    return inventory
