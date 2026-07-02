#!/usr/bin/env python3

from pydantic import BaseModel, EmailStr


# -------------------------
# USER CREATE (REGISTER)
# -------------------------
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


# -------------------------
# USER LOGIN
# -------------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# -------------------------
# USER RESPONSE
# -------------------------
class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True
