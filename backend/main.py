"""
FastAPI Application - Main Entry Point
Self-Improving AI System for Engineering Problem Solving
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import time
import json

from backend.config import settings
from backend.database import get_db, init_db
from backend.models import Problem, BaselineSolution, ImprovedSolution, Experiment, ExperimentResult, SystemLog
from backend.self_improving_solver import SelfImprovingSolver
from backend.problems import get_problem_by_id, get_problems_by_domain

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("senior_project")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Senior Project AI System...")
    await init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down Senior Project AI System...")


app = FastAPI(
    title="Self-Improving AI System",
    description="AI-based system for engineering problem solving with self-reflection capabilities",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["*"],
    max_age=600,
)


@app.get("/")
async def root():
    return {
        "name": "Self-Improving AI System",
        "version": "1.0.0",
        "description": "AI-based system for engineering problem solving with self-reflection",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    config_status = settings.validate_connection()
    return {
        "status": "healthy" if config_status["valid"] else "degraded",
        "debug": settings.DEBUG,
        "api_configured": config_status["valid"],
        "issues": config_status["issues"],
        "warnings": config_status["warnings"]
    }


@app.get("/api/config/status")
async def get_config_status():
    status = settings.validate_connection()
    return {
        "configured": status["valid"],
        "debug_mode": status["debug_mode"],
        "has_warnings": len(status["warnings"]) > 0
    }


@app.get("/api/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    problem_count = (await db.execute(select(func.count(Problem.id)))).scalar()
    baseline_count = (await db.execute(select(func.count(BaselineSolution.id)))).scalar()
    improved_count = (await db.execute(select(func.count(ImprovedSolution.id)))).scalar()
    experiment_count = (await db.execute(select(func.count(Experiment.id)))).scalar()

    recent_experiments = (await db.execute(
        select(Experiment).order_by(Experiment.created_at.desc()).limit(5)
    )).scalars().all()

    return {
        "total_problems": problem_count or 0,
        "total_baseline_solutions": baseline_count or 0,
        "total_improved_solutions": improved_count or 0,
        "total_experiments": experiment_count or 0,
        "recent_experiments": [
            {
                "id": e.id,
                "name": e.name,
                "status": e.status,
                "baseline_accuracy": e.baseline_accuracy,
                "improved_accuracy": e.improved_accuracy,
                "completed_at": e.completed_at.isoformat() if e.completed_at else None
            }
            for e in recent_experiments
        ]
    }


@app.get("/api/problems")
async def list_problems(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem)
    if domain:
        query = query.where(Problem.domain == domain)
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)

    db_problems = (await db.execute(query)).scalars().all()

    if db_problems:
        return [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "domain": p.domain,
                "difficulty": p.difficulty,
                "source": "database"
            }
            for p in db_problems
        ]

    filtered = get_problems_by_domain(domain, difficulty)
    return [
        {
            "id": p["id"],
            "title": p["title"],
            "description": p["description"],
            "domain": p["domain"],
            "difficulty": p["difficulty"],
            "source": "builtin"
        }
        for p in filtered
    ]


@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: int, db: AsyncSession = Depends(get_db)):
    db_problem = (await db.execute(select(Problem).where(Problem.id == problem_id))).scalar()

    if db_problem:
        return {
            "id": db_problem.id,
            "title": db_problem.title,
            "description": db_problem.description,
            "domain": db_problem.domain,
            "difficulty": db_problem.difficulty,
            "known_variables": db_problem.known_variables,
            "unknown_variables": db_problem.unknown_variables,
            "expected_answer": db_problem.expected_answer,
            "expected_unit": db_problem.expected_unit,
            "source": "database"
        }

    problem = get_problem_by_id(problem_id)
    if problem:
        return {**problem, "source": "builtin"}

    raise HTTPException(status_code=404, detail="Problem not found")


@app.post("/api/problems")
async def create_problem(
    title: str,
    description: str,
    domain: str,
    difficulty: str = "medium",
    expected_answer: Optional[float] = None,
    expected_unit: Optional[str] = None,
    known_variables: list = None,
    unknown_variables: list = None,
    db: AsyncSession = Depends(get_db)
):
    problem = Problem(
        title=title,
        description=description,
        domain=domain,
        difficulty=difficulty,
        expected_answer=expected_answer,
        expected_unit=expected_unit,
        known_variables=known_variables or [],
        unknown_variables=unknown_variables or []
    )

    db.add(problem)
    await db.commit()
    await db.refresh(problem)

    logger.info(f"Created problem: {problem.id} - {problem.title}")

    return {"id": problem.id, "title": problem.title, "status": "created"}


@app.post("/api/solve/baseline")
async def solve_baseline(
    problem_text: str,
    domain: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    solver = SelfImprovingSolver()
    baseline = await solver.baseline_solver.solve(problem_text)

    db_solution = BaselineSolution(
        problem_id=None,
        steps=baseline.get("steps", []),
        final_answer=baseline.get("final_answer"),
        final_unit=baseline.get("final_unit"),
        explanation=baseline.get("explanation"),
        confidence_score=0.7,
        execution_time=baseline.get("execution_time", 0)
    )

    db.add(db_solution)
    await db.commit()

    return {
        "solution": baseline,
        "method": "baseline",
        "saved": True
    }


@app.post("/api/solve/improved")
async def solve_improved(
    problem_text: str,
    expected_answer: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
):
    solver = SelfImprovingSolver()
    result = await solver.solve(problem_text, expected_answer)

    baseline = result["baseline_solution"]
    db_baseline = BaselineSolution(
        steps=baseline.get("steps", []),
        final_answer=baseline.get("final_answer"),
        final_unit=baseline.get("final_unit"),
        explanation=baseline.get("explanation"),
        confidence_score=baseline.get("confidence_score", 0.7),
        execution_time=baseline.get("execution_time", 0)
    )
    db.add(db_baseline)
    await db.flush()

    improved = result["improved_solution"]
    db_improved = ImprovedSolution(
        baseline_solution_id=db_baseline.id,
        original_steps=baseline.get("steps", []),
        critique=result["critique"].get("issues_found", []),
        revised_steps=improved.get("steps", []),
        final_answer=improved.get("final_answer"),
        final_unit=improved.get("final_unit"),
        explanation=improved.get("explanation"),
        confidence_score=result["confidence_score"],
        improvement_made=result["improvement_made"],
        execution_time=result["execution_time"]["total"]
    )
    db.add(db_improved)
    await db.commit()

    return {
        "result": result,
        "method": "self-improving",
        "saved": True
    }


@app.post("/api/solve/custom")
async def solve_custom(
    problem_id: Optional[int] = None,
    problem_text: Optional[str] = None,
    use_improved: bool = True,
    db: AsyncSession = Depends(get_db)
):
    if problem_id:
        db_problem = (await db.execute(select(Problem).where(Problem.id == problem_id))).scalar()
        if db_problem:
            problem_text = db_problem.description
            expected_answer = db_problem.expected_answer
        else:
            problem = get_problem_by_id(problem_id)
            if problem:
                problem_text = problem["description"]
                expected_answer = problem.get("expected_answer")
            else:
                raise HTTPException(status_code=404, detail="Problem not found")
    elif not problem_text:
        raise HTTPException(status_code=400, detail="Either problem_id or problem_text required")
    else:
        expected_answer = None

    solver = SelfImprovingSolver()

    if use_improved:
        result = await solver.solve(problem_text, expected_answer)
        method = "self-improving"
    else:
        baseline = await solver.baseline_solver.solve(problem_text)
        result = {"baseline_solution": baseline, "improved_solution": baseline}
        method = "baseline"

    return {
        "problem_id": problem_id,
        "problem_text": problem_text,
        "result": result,
        "method": method
    }


@app.post("/api/experiments/run")
async def run_experiment(
    name: str,
    description: Optional[str] = None,
    problem_ids: Optional[List[int]] = None,
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db)
):
    if problem_ids:
        problems = []
        for pid in problem_ids:
            p = get_problem_by_id(pid)
            if p:
                problems.append(p)
    else:
        problems = get_problems_by_domain(domain, difficulty)

    if not problems:
        raise HTTPException(status_code=400, detail="No problems found for the specified criteria")

    experiment = Experiment(
        name=name,
        description=description,
        total_problems=len(problems),
        status="running",
        started_at=time.time()
    )
    db.add(experiment)
    await db.flush()

    async def run_experiment_background():
        solver = SelfImprovingSolver()
        baseline_correct = 0
        improved_correct = 0
        improvements_made = 0
        results = []

        for i, problem in enumerate(problems):
            try:
                result = await solver.solve(
                    problem["description"],
                    problem.get("expected_answer")
                )

                if result["baseline_solution"].get("is_correct"):
                    baseline_correct += 1
                if result["is_correct"]:
                    improved_correct += 1
                if result["improvement_made"]:
                    improvements_made += 1

                db_result = ExperimentResult(
                    experiment_id=experiment.id,
                    problem_id=problem["id"],
                    baseline_correct=result["baseline_solution"].get("is_correct", False),
                    improved_correct=result["is_correct"],
                    baseline_confidence=result["baseline_solution"].get("confidence_score", 0),
                    improved_confidence=result["confidence_score"],
                    errors_detected=result["critique"].get("issues_found", []),
                    improvement_details=json.dumps(result["critique"])
                )
                db.add(db_result)
                results.append(db_result)

                experiment.completed_problems = i + 1
                await db.flush()

            except Exception as e:
                logger.error(f"Error solving problem {problem['id']}: {e}")

        n = len(problems)
        experiment.baseline_accuracy = baseline_correct / n if n > 0 else 0
        experiment.improved_accuracy = improved_correct / n if n > 0 else 0
        experiment.error_detection_rate = improvements_made / n if n > 0 else 0
        experiment.avg_improvement = (improved_correct - baseline_correct) / n if n > 0 else 0
        experiment.status = "completed"
        experiment.completed_at = time.time()

        await db.commit()
        logger.info(f"Experiment {experiment.id} completed: baseline={experiment.baseline_accuracy:.2%}, improved={experiment.improved_accuracy:.2%}")

    if len(problems) > 5:
        background_tasks.add_task(run_experiment_background)
        return {
            "experiment_id": experiment.id,
            "name": name,
            "status": "running",
            "total_problems": len(problems),
            "message": "Experiment started in background"
        }
    else:
        await run_experiment_background()
        return {
            "experiment_id": experiment.id,
            "name": name,
            "status": "completed",
            "baseline_accuracy": experiment.baseline_accuracy,
            "improved_accuracy": experiment.improved_accuracy,
            "total_problems": len(problems)
        }


@app.get("/api/experiments")
async def list_experiments(db: AsyncSession = Depends(get_db)):
    experiments = (await db.execute(
        select(Experiment).order_by(Experiment.created_at.desc())
    )).scalars().all()

    return [
        {
            "id": e.id,
            "name": e.name,
            "description": e.description,
            "status": e.status,
            "baseline_accuracy": e.baseline_accuracy,
            "improved_accuracy": e.improved_accuracy,
            "error_detection_rate": e.error_detection_rate,
            "total_problems": e.total_problems,
            "completed_problems": e.completed_problems,
            "created_at": e.created_at.isoformat() if e.created_at else None,
            "completed_at": e.completed_at.isoformat() if e.completed_at else None
        }
        for e in experiments
    ]


@app.get("/api/experiments/{experiment_id}")
async def get_experiment(experiment_id: int, db: AsyncSession = Depends(get_db)):
    experiment = (await db.execute(
        select(Experiment).where(Experiment.id == experiment_id)
    )).scalar()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    results = (await db.execute(
        select(ExperimentResult).where(ExperimentResult.experiment_id == experiment_id)
    )).scalars().all()

    return {
        "experiment": {
            "id": experiment.id,
            "name": experiment.name,
            "description": experiment.description,
            "status": experiment.status,
            "baseline_accuracy": experiment.baseline_accuracy,
            "improved_accuracy": experiment.improved_accuracy,
            "error_detection_rate": experiment.error_detection_rate,
            "avg_improvement": experiment.avg_improvement,
            "total_problems": experiment.total_problems,
            "completed_problems": experiment.completed_problems
        },
        "results": [
            {
                "problem_id": r.problem_id,
                "baseline_correct": r.baseline_correct,
                "improved_correct": r.improved_correct,
                "baseline_confidence": r.baseline_confidence,
                "improved_confidence": r.improved_confidence,
                "errors_detected": r.errors_detected
            }
            for r in results
        ]
    }


@app.get("/api/logs")
async def get_logs(limit: int = 100, db: AsyncSession = Depends(get_db)):
    logs = (await db.execute(
        select(SystemLog).order_by(SystemLog.timestamp.desc()).limit(limit)
    )).scalars().all()

    return [
        {
            "id": log.id,
            "level": log.level,
            "message": log.message,
            "module": log.module,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "details": log.details
        }
        for log in logs
    ]


@app.get("/api/analysis/comparison")
async def get_comparison_analysis(db: AsyncSession = Depends(get_db)):
    experiments = (await db.execute(
        select(Experiment).where(Experiment.status == "completed")
    )).scalars().all()

    if not experiments:
        return {
            "message": "No completed experiments found. Run an experiment first.",
            "data": None
        }

    total_baseline_correct = sum(e.baseline_accuracy * e.total_problems for e in experiments)
    total_improved_correct = sum(e.improved_accuracy * e.total_problems for e in experiments)
    total_problems = sum(e.total_problems for e in experiments)

    avg_baseline = total_baseline_correct / total_problems if total_problems > 0 else 0
    avg_improved = total_improved_correct / total_problems if total_problems > 0 else 0
    improvement = avg_improved - avg_baseline

    return {
        "summary": {
            "total_experiments": len(experiments),
            "total_problems_solved": total_problems,
            "baseline_accuracy": avg_baseline,
            "improved_accuracy": avg_improved,
            "accuracy_improvement": improvement,
            "improvement_percentage": (improvement / avg_baseline * 100) if avg_baseline > 0 else 0
        },
        "experiments": [
            {
                "name": e.name,
                "baseline": e.baseline_accuracy,
                "improved": e.improved_accuracy,
                "improvement": e.improved_accuracy - e.baseline_accuracy
            }
            for e in experiments
        ],
        "conclusion": "Self-improvement module shows positive impact" if improvement > 0 else "Further analysis needed"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
