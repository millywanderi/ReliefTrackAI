#!/usr/bin/env python3

from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import beneficiaries
from app.api.v1.endpoints import households
from app.api.v1.endpoints import household_members
from app.api.v1.endpoints import vulnerability_assessments
from app.api.v1.endpoints import warehouses
from app.api.v1.endpoints import resources
from app.api.v1.endpoints import stock_transactions
from app.api.v1.endpoints import stock_monitoring
from app.api.v1.endpoints import distribution_events
from app.api.v1.endpoints import distribution_resources
from app.api.v1.endpoints import distribution_verifications

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(beneficiaries.router)
api_router.include_router(households.router)
api_router.include_router(household_members.router)
api_router.include_router(vulnerability_assessments.router)
api_router.include_router(warehouses.router)
api_router.include_router(resources.router)
api_router.include_router(stock_transactions.router)
api_router.include_router(stock_monitoring.router)
api_router.include_router(distribution_events.router)
api_router.include_router(distribution_resources.router)
api_router.include_router(distribution_verifications.router)

