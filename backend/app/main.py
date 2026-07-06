#!/usr/bin/env python3

from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(
    title="ReliefTrack AI API",
    version="1.0.0",
    description="AI-powered Humanitarian Resource Management Platform",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "ReliefTrack AI running"}
