#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.schemas.ai_report import (
    AIExecutiveReportResponse,
)

from app.services import ai_report_service

router = APIRouter(
    prefix="/ai",
    tags=["AI Executive Report"],
)


@router.get(
    "/executive-report",
    response_model=AIExecutiveReportResponse,
)
def executive_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ai_report_service.generate_executive_report(db)
