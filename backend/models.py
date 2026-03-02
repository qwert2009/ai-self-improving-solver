from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timezone

Base = declarative_base()


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False)
    difficulty = Column(String(20), default="medium")
    known_variables = Column(JSON, default=list)
    unknown_variables = Column(JSON, default=list)
    expected_answer = Column(Float, nullable=True)
    expected_unit = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    baseline_solutions = relationship("BaselineSolution", back_populates="problem", cascade="all, delete-orphan")
    improved_solutions = relationship("ImprovedSolution", back_populates="problem", cascade="all, delete-orphan")


class BaselineSolution(Base):
    __tablename__ = "baseline_solutions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    problem = relationship("Problem", back_populates="baseline_solutions")

    steps = Column(JSON, default=list)
    final_answer = Column(Float, nullable=True)
    final_unit = Column(String(50), nullable=True)
    explanation = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)
    is_correct = Column(Boolean, default=False)
    error_type = Column(String(100), nullable=True)
    execution_time = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ImprovedSolution(Base):
    __tablename__ = "improved_solutions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    problem = relationship("Problem", back_populates="improved_solutions")
    baseline_solution_id = Column(Integer, ForeignKey("baseline_solutions.id"), nullable=True)

    original_steps = Column(JSON, default=list)
    critique = Column(JSON, default=list)
    revised_steps = Column(JSON, default=list)
    final_answer = Column(Float, nullable=True)
    final_unit = Column(String(50), nullable=True)
    explanation = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)
    is_correct = Column(Boolean, default=False)
    improvement_made = Column(Boolean, default=False)
    execution_time = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    baseline_accuracy = Column(Float, default=0.0)
    improved_accuracy = Column(Float, default=0.0)
    error_detection_rate = Column(Float, default=0.0)
    avg_improvement = Column(Float, default=0.0)
    total_problems = Column(Integer, default=0)
    completed_problems = Column(Integer, default=0)
    status = Column(String(20), default="pending")
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    results = relationship("ExperimentResult", back_populates="experiment", cascade="all, delete-orphan")


class ExperimentResult(Base):
    __tablename__ = "experiment_results"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id"), nullable=False)
    experiment = relationship("Experiment", back_populates="results")
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)

    baseline_correct = Column(Boolean, default=False)
    improved_correct = Column(Boolean, default=False)
    baseline_confidence = Column(Float, default=0.0)
    improved_confidence = Column(Float, default=0.0)
    errors_detected = Column(JSON, default=list)
    improvement_details = Column(Text, nullable=True)


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), default="INFO")
    message = Column(Text, nullable=False)
    module = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    details = Column(JSON, default=dict)
