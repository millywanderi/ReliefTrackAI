#!/usr/bin/env python3

from fastapi import FastAPI
from app.api.v1.router import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ReliefTrack AI API",
    version="1.0.0",
    description="AI-powered Humanitarian Resource Management Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "ReliefTrack AI running"}
