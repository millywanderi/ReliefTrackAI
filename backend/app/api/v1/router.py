#!/usr/bin/env python3

from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import beneficiaries

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(beneficiaries.router)
