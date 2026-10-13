#!/usr/bin/env python3


from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from app.models.distribution_event import DistributionEvent
from app.models.distribution_resource import DistributionResource
from app.models.distribution_verification import DistributionVerification
from app.models.resource import Resource
from app.services import distribution_resource_service as service


def make_test_setup(
    existing_quantity=10,
    delivered_quantity=0,
    available_excluding_event=15,
):
    """Build mocked database objects; no real database is used."""

    db = MagicMock()

    event = SimpleNamespace(
        id=6,
        warehouse_id=1,
        status="Planned",
    )

    resource = SimpleNamespace(
        id=1,
        name="Rice",
    )

    existing_allocation = SimpleNamespace(
        id=4,
        distribution_event_id=6,
        resource_id=1,
        quantity=existing_quantity,
    )

    event_query = MagicMock()
    event_query.filter.return_value.first.return_value = event

    resource_query = MagicMock()
    resource_query.filter.return_value.first.return_value = resource

    allocation_query = MagicMock()
    allocation_query.filter.return_value.first.return_value = (
        existing_allocation
    )

    verification_query = MagicMock()
    verification_query.filter.return_value.scalar.return_value = (
        delivered_quantity
    )

    def query_side_effect(model, *args, **kwargs):
        if model is DistributionEvent:
            return event_query
        if model is Resource:
            return resource_query
        if model is DistributionResource:
            return allocation_query
        if model is DistributionVerification:
            return verification_query
        raise AssertionError(f"Unexpected model queried: {model}")

    db.query.side_effect = query_side_effect

    allocation_request = SimpleNamespace(
        distribution_event_id=6,
        resource_id=1,
        quantity=1,
    )

    return (
        db,
        existing_allocation,
        allocation_request,
        available_excluding_event,
    )


def test_rejects_additional_allocation_when_stock_is_insufficient():
    db, existing, request, available = make_test_setup(
        existing_quantity=10,
        available_excluding_event=15,
    )

    # 15 available minus 10 already allocated = 5 additional units.
    request.quantity = 6

    with patch.object(
        service,
        "get_available_stock",
        return_value=available,
    ):
        with pytest.raises(HTTPException) as exc_info:
            service.create_distribution_resource(db, request)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == (
        "Only 5 additional units are available for allocation."
    )
    assert existing.quantity == 10
    db.commit.assert_not_called()


def test_allows_additional_allocation_when_stock_is_sufficient():
    db, existing, request, available = make_test_setup(
        existing_quantity=10,
        available_excluding_event=15,
    )

    # Exactly 5 additional units are available.
    request.quantity = 5

    with patch.object(
        service,
        "get_available_stock",
        return_value=available,
    ):
        result = service.create_distribution_resource(db, request)

    assert result is existing
    assert existing.quantity == 15
    db.commit.assert_called_once_with()
    db.refresh.assert_called_once_with(existing)
