#!/usr/bin/env python3

from pydantic import BaseModel


class TopResourceResponse(BaseModel):
    resource: str
    total_distributed: int
