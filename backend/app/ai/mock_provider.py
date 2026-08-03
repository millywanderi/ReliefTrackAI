#!/usr/bin/env python3

from app.ai.base import BaseAIProvider


class MockAIProvider(BaseAIProvider):

    def generate_report(
        self,
        dashboard,
        forecast,
        predictive,
        fraud,
    ):

        return (
            f"""
ReliefTrack AI Executive Summary

Total Beneficiaries: {dashboard['beneficiaries']}
Warehouses: {dashboard['warehouses']}

Highest Demand Resource:
{forecast['resource']}

Predicted Demand:
{forecast['predicted_next_month']}

Fraud Alerts:
{len(fraud)}

Highest Risk Warehouse:
{predictive['highest_risk_warehouse']}

Recommendation:

{predictive['recommendation']}
"""
        )
