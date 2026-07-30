#!/usr/bin/env python3

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.models.distribution_verification import DistributionVerification


def get_top_resources(db: Session):

    results = (
        db.query(
            Resource.name.label("resource"),
            func.sum(
                DistributionVerification.quantity
            ).label("total_distributed"),
        )
        .join(
            DistributionVerification,
            DistributionVerification.resource_id == Resource.id,
        )
        .filter(
            DistributionVerification.status == "Delivered"
        )
        .group_by(Resource.name)
        .order_by(
            func.sum(
                DistributionVerification.quantity
            ).desc()
        )
        .all()
    )

    return [
        {
            "resource": row.resource,
            "total_distributed": row.total_distributed,
        }
        for row in results
    ]
