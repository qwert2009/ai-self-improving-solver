import time
from typing import Dict, Any, Optional
from backend.solver import BaselineSolver
from backend.critic import CriticAgent


class SelfImprovingSolver:
    def __init__(self, llm_provider: str = "deepseek"):
        self.baseline_solver = BaselineSolver(llm_provider=llm_provider)
        self.critic_agent = CriticAgent(llm_provider=llm_provider)

    async def solve(self, problem_text: str, expected_answer: float = None) -> Dict[str, Any]:
        total_start = time.time()

        baseline_solution = await self.baseline_solver.solve(problem_text)
        critique_result = await self.critic_agent.critique(problem_text, baseline_solution)

        if critique_result.get("improvement_made", False) and critique_result.get("revised_solution", {}).get("final_answer") is not None:
            final_solution = critique_result["revised_solution"]
            improvement_made = True
        else:
            final_solution = baseline_solution
            improvement_made = False

        final_confidence = self.critic_agent.calculate_confidence(critique_result)

        is_correct = None
        if expected_answer is not None:
            final_answer = final_solution.get("final_answer")
            if final_answer is not None:
                try:
                    is_correct = abs(float(final_answer) - expected_answer) < 0.01 * abs(expected_answer)
                except (ValueError, TypeError):
                    is_correct = False

        total_time = time.time() - total_start

        return {
            "problem_text": problem_text,
            "baseline_solution": baseline_solution,
            "critique": {
                "issues_found": critique_result.get("issues_found", []),
                "original_solution_valid": critique_result.get("original_solution_valid", True),
                "comparison": critique_result.get("comparison", ""),
                "recommendation": critique_result.get("recommendation", "Use original")
            },
            "improved_solution": final_solution,
            "improvement_made": improvement_made,
            "confidence_score": final_confidence,
            "is_correct": is_correct,
            "execution_time": {
                "baseline": baseline_solution.get("execution_time", 0),
                "critique": critique_result.get("execution_time", 0),
                "total": total_time
            }
        }

    async def run_experiment(self, problems: list) -> Dict[str, Any]:
        results = []
        baseline_correct = 0
        improved_correct = 0
        improvements_made = 0
        total_baseline_time = 0
        total_improved_time = 0

        for problem in problems:
            result = await self.solve(
                problem["text"],
                problem.get("expected_answer")
            )
            results.append(result)

            if result["is_correct"] is not None:
                if result["baseline_solution"].get("is_correct", False):
                    baseline_correct += 1
                if result["is_correct"]:
                    improved_correct += 1

            if result["improvement_made"]:
                improvements_made += 1

            total_baseline_time += result["execution_time"]["baseline"]
            total_improved_time += result["execution_time"]["total"]

        n = len(problems)

        return {
            "results": results,
            "statistics": {
                "total_problems": n,
                "baseline_accuracy": baseline_correct / n if n > 0 else 0,
                "improved_accuracy": improved_correct / n if n > 0 else 0,
                "improvement_rate": improvements_made / n if n > 0 else 0,
                "accuracy_improvement": (improved_correct - baseline_correct) / n if n > 0 else 0,
                "avg_baseline_time": total_baseline_time / n if n > 0 else 0,
                "avg_improved_time": total_improved_time / n if n > 0 else 0
            }
        }
