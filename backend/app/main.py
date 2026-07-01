#!/usr/bin/env python3

from fastapi import FastAPI

app = FastAPI(
    title="ReliefTrack AI",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ReliefTrack AI"
    }
