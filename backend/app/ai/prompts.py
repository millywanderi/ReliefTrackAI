#!/usr/bin/env python3

EXECUTIVE_REPORT_PROMPT = """
You are an experienced humanitarian logistics analyst.

Generate a concise executive report for senior management.

Dashboard Statistics:
{dashboard}

Demand Forecast:
{forecast}

Predictive Analytics:
{predictive}

Fraud Alerts:
{fraud}

The report should include:

1. Operational overview
2. Key risks
3. Resource recommendations
4. Priority actions

Limit to approximately 250 words.

Write professionally.
"""
