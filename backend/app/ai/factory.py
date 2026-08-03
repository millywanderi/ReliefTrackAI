#!/usr/bin/env python3

from app.ai.mock_provider import MockAIProvider
from app.ai.openai_provider import OpenAIProvider
from app.core.config import settings


def get_ai_provider():

    if settings.AI_PROVIDER.lower() == "openai":
        return OpenAIProvider()

    return MockAIProvider()
