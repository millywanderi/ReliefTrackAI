#!/usr/bin/env python3

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.config import settings
from app.schemas.user import UserCreate, UserLogin

from app.models.user import User
from app.auth.dependencies import get_current_user

from app.models.role import Role

router = APIRouter(prefix="/auth", tags=["Authentication"])


# -------------------------
# REGISTER
# -------------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # get default role from database (IMPORTANT FIX)
    role = db.query(Role).filter(Role.name == "admin").first()

    if not role:
        raise HTTPException(
            status_code=500,
            detail="Default role 'admin' does not exist in database. Please create it first."
        )

    # create user
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role_id=role.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": f"{current_user.first_name} {current_user.last_name}",
        "role_id": current_user.role_id
    }
