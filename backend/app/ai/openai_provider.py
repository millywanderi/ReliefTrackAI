#!/usr/bin/env python3

from openai import OpenAI

from app.ai.base import BaseAIProvider
from app.ai.prompts import EXECUTIVE_REPORT_PROMPT
from app.core.config import settings


class OpenAIProvider(BaseAIProvider):

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

    def generate_report(
        self,
        dashboard,
        forecast,
        predictive,
        fraud,
    ):

        prompt = EXECUTIVE_REPORT_PROMPT.format(
            dashboard=dashboard,
            forecast=forecast,
            predictive=predictive,
            fraud=fraud,
        )

        response = self.client.responses.create(
            model=settings.OPENAI_MODEL,
            input=prompt,
        )

        return response.output_text
