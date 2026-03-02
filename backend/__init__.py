"""
Backend package for Self-Improving AI System
"""
from backend.config import settings
from backend.database import init_db, get_db
from backend.models import Problem, BaselineSolution, ImprovedSolution, Experiment, ExperimentResult
from backend.solver import BaselineSolver
from backend.critic import CriticAgent
from backend.self_improving_solver import SelfImprovingSolver
from backend.llm_client import LLMClient

__all__ = [
    "settings",
    "init_db",
    "get_db",
    "Problem",
    "BaselineSolution",
    "ImprovedSolution",
    "Experiment",
    "ExperimentResult",
    "BaselineSolver",
    "CriticAgent",
    "SelfImprovingSolver",
    "LLMClient"
]
