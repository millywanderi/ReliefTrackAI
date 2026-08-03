#!/usr/bin/env python3

from abc import ABC, abstractmethod


class BaseAIProvider(ABC):

    @abstractmethod
    def generate_report(
        self,
        dashboard,
        forecast,
        predictive,
        fraud,
    ):
        pass
