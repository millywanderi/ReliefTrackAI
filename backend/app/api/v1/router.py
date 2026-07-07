#!/usr/bin/env python3

from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import beneficiaries
from app.api.v1.endpoints import households
from app.api.v1.endpoints import household_members

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(beneficiaries.router)
api_router.include_router(households.router)
api_router.include_router(household_members.router)
