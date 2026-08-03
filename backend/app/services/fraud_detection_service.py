#!/usr/bin/env python3

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.distribution_verification import DistributionVerification
from app.models.distribution_resource import DistributionResource
from app.models.stock_transaction import StockTransaction


def detect_fraud(db: Session):

    alerts = []

    #
    # Rule 1
    # Duplicate Deliveries
    #
    duplicates = (
        db.query(
            DistributionVerification.beneficiary_id,
            DistributionVerification.resource_id,
            func.count().label("count"),
        )
        .group_by(
            DistributionVerification.beneficiary_id,
            DistributionVerification.resource_id,
        )
        .having(func.count() > 1)
        .all()
    )

    for row in duplicates:
        alerts.append(
            {
                "rule": "Duplicate Delivery",
                "severity": "High",
                "description":
                    f"Beneficiary {row.beneficiary_id} "
                    f"received Resource {row.resource_id} "
                    f"{row.count} times.",
            }
        )

    #
    # Rule 2
    # Over Allocation
    #
    verifications = db.query(
        DistributionVerification
    ).all()

    for verification in verifications:

        allocation = (
            db.query(
                DistributionResource
            )
            .filter(
                DistributionResource.distribution_event_id
                == verification.distribution_event_id,
                DistributionResource.resource_id
                == verification.resource_id,
            )
            .first()
        )

        if allocation and verification.quantity > allocation.quantity:

            alerts.append(
                {
                    "rule": "Over Allocation",
                    "severity": "Critical",
                    "description":
                        f"Verification {verification.id} "
                        "exceeds allocated quantity.",
                }
            )

    #
    # Rule 3
    # Large Distribution
    #
    LARGE_THRESHOLD = 1000

    large = (
        db.query(
            DistributionVerification
        )
        .filter(
            DistributionVerification.quantity
            > LARGE_THRESHOLD
        )
        .all()
    )

    for verification in large:

        alerts.append(
            {
                "rule": "Large Distribution",
                "severity": "Medium",
                "description":
                    f"Verification {verification.id} "
                    f"distributed {verification.quantity} units.",
            }
        )

    #
    # Rule 4
    # Negative Inventory
    #
    inventory = (
        db.query(
            StockTransaction.resource_id,
            func.sum(
                StockTransaction.quantity
            ).label("balance"),
        )
        .group_by(
            StockTransaction.resource_id
        )
        .all()
    )

    for row in inventory:

        if row.balance < 0:

            alerts.append(
                {
                    "rule": "Negative Inventory",
                    "severity": "Critical",
                    "description":
                        f"Resource {row.resource_id} "
                        "has negative stock.",
                }
            )

    return alerts
