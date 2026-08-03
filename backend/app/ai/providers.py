#!/usr/bin/env python3

from app.ai.prompts import EXECUTIVE_REPORT_PROMPT


class AIProvider:

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

        #
        # Temporary fallback.
        # We'll replace this with an LLM call.
        #

        return (
            "AI Report\n\n"
            f"{prompt}"
        )
