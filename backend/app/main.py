#!/usr/bin/env python3

from fastapi import FastAPI
from app.api.v1.endpoints import auth

app = FastAPI(
    title="ReliefTrack AI API",
    version="1.0.0",
    description="AI-powered Humanitarian Resource Management Platform",
)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "ReliefTrack AI running"}
