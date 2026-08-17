#!/usr/bin/env python3

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.stock_transaction import StockTransaction
from app.models.resource import Resource
from app.models.warehouse import Warehouse


VALID_TRANSACTION_TYPES = {
    "STOCK_IN",
    "STOCK_OUT",
    "TRANSFER_IN",
    "TRANSFER_OUT",
    "ADJUSTMENT",
    "DAMAGED",
}


def create_stock_transaction(
    db: Session,
    transaction_data,
    current_user,
):

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == transaction_data.warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found."
        )

    resource = db.query(Resource).filter(
        Resource.id == transaction_data.resource_id
    ).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found."
        )

    transaction_type = transaction_data.transaction_type.strip().upper()

    if transaction_type not in VALID_TRANSACTION_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transaction type: {transaction_data.transaction_type!r}. "
                   f"Expected one of: {sorted(VALID_TRANSACTION_TYPES)}"
        )

    transaction = StockTransaction(
        warehouse_id=transaction_data.warehouse_id,
        resource_id=transaction_data.resource_id,
        transaction_type=transaction_type,
        quantity=transaction_data.quantity,
        reference=transaction_data.reference,
        notes=transaction_data.notes,
        created_by=current_user.id,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def get_all_stock_transactions(
    db: Session,
):

    return db.query(StockTransaction).all()


def get_stock_transaction(
    db: Session,
    transaction_id: int,
):

    transaction = db.query(StockTransaction).filter(
        StockTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found."
        )

    return transaction


def delete_stock_transaction(
    db: Session,
    transaction_id: int,
):

    transaction = get_stock_transaction(
        db,
        transaction_id,
    )

    db.delete(transaction)
    db.commit()

    return {
        "message": "Transaction deleted successfully."
    }
