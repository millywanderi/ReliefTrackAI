#!/usr/bin/env python3

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True

    AI_PROVIDER: str = "mock"

    OPENAI_API_KEY: str | None = None

    OPENAI_MODEL: str = "gpt-5"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
