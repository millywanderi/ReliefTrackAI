#!/usr/bin/env python3

from fastapi import FastAPI

app = FastAPI(
    title="ReliefTrack AI API",
    version="1.0.0",
    description="AI-powered Humanitarian Resource Management Platform",
)


@app.get("/")
def root():
    return {
        "application": "ReliefTrack AI",
        "status": "running",
        "version": "1.0.0",
    }
