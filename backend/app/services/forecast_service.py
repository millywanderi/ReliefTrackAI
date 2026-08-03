#!/usr/bin/env python3

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.models.distribution_verification import (
    DistributionVerification,
)


def forecast_resources(db: Session):

    forecasts = []

    resources = db.query(Resource).all()

    for resource in resources:

        total = (
            db.query(
                func.coalesce(
                    func.sum(
                        DistributionVerification.quantity
                    ),
                    0,
                )
            )
            .filter(
                DistributionVerification.resource_id == resource.id,
                DistributionVerification.status == "Delivered",
            )
            .scalar()
        )

        months = (
            db.query(
                func.count(
                    func.distinct(
                        func.date_trunc(
                            "month",
                            DistributionVerification.verification_date,
                        )
                    )
                )
            )
            .filter(
                DistributionVerification.resource_id == resource.id,
                DistributionVerification.status == "Delivered",
            )
            .scalar()
        )

        months = max(months, 1)

        average = round(total / months, 2)

        #
        # Simple forecasting model
        #
        # Increase prediction by 10%
        # to simulate increasing demand.
        #
        growth_factor = 1.10

        prediction = round(
            average * growth_factor,
            2,
        )

        if prediction > average * 1.5:
            recommendation = "Increase procurement immediately"

        elif prediction > average:
            recommendation = "Plan additional stock"

        else:
            recommendation = "Current stock levels acceptable"

        forecasts.append(
            {
                "resource": resource.name,
                "historical_total": total,
                "months_observed": months,
                "monthly_average": average,
                "growth_factor": growth_factor,
                "predicted_next_month": prediction,
                "recommendation": recommendation,
            }
        )

    forecasts.sort(
        key=lambda x: x["predicted_next_month"],
        reverse=True,
    )

    return forecasts
