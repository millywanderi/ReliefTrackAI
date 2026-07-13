#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.stock_transaction import (
    StockTransactionCreate,
    StockTransactionResponse,
)

from app.services import stock_transaction_service

router = APIRouter(
    prefix="/stock-transactions",
    tags=["Stock Transactions"],
)


# ---------------------------------
# CREATE STOCK TRANSACTION
# ---------------------------------
@router.post("/", response_model=StockTransactionResponse)
def create_stock_transaction(
    transaction: StockTransactionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return stock_transaction_service.create_stock_transaction(
        db,
        transaction,
        current_user,
    )


# ---------------------------------
# GET ALL STOCK TRANSACTIONS
# ---------------------------------
@router.get("/", response_model=list[StockTransactionResponse])
def get_all_stock_transactions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return stock_transaction_service.get_all_stock_transactions(db)


# ---------------------------------
# GET SINGLE STOCK TRANSACTION
# ---------------------------------
@router.get("/{transaction_id}", response_model=StockTransactionResponse)
def get_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return stock_transaction_service.get_stock_transaction(
        db,
        transaction_id,
    )


# ---------------------------------
# DELETE STOCK TRANSACTION
# ---------------------------------
@router.delete("/{transaction_id}")
def delete_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return stock_transaction_service.delete_stock_transaction(
        db,
        transaction_id,
    )
