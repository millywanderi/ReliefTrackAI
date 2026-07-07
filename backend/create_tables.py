#!/usr/bin/env python3

from app.core.database import Base, engine

# Import all models so SQLAlchemy registers them
from app.models.role import Role
from app.models.user import User
from app.models.beneficiary import Beneficiary
from app.models.household import Household
from app.models.household_member import HouseholdMember
from app.models.vulnerability_assessment import VulnerabilityAssessment

Base.metadata.create_all(bind=engine)

print("✅ All database tables created successfully!")
