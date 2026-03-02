import time
import re
import json
from typing import Dict, Any, List, Optional, Tuple
from sympy import symbols, Eq, solve, sympify, N
from backend.llm_client import LLMClient


class BaselineSolver:
    DOMAIN_PROMPTS = {
        "mechanics": """You are an expert in Newtonian mechanics. Analyze the problem and:
1. Identify all known variables with their values and units
2. Identify unknown variables to solve for
3. Select appropriate physics equations (F=ma, kinematic equations, energy conservation, etc.)
4. Solve step-by-step showing all calculations
5. Provide final answer with correct units

Format your response as JSON:
{
    "domain": "mechanics",
    "known_variables": [{"name": "v", "value": 10, "unit": "m/s"}],
    "unknown_variables": ["a"],
    "equations_used": ["v = u + at"],
    "steps": ["Step 1: ...", "Step 2: ..."],
    "final_answer": 5.0,
    "final_unit": "m/s²",
    "explanation": "Detailed explanation..."
}""",

        "circuits": """You are an expert in electrical circuits. Analyze the problem and:
1. Identify all known variables (voltage, current, resistance, etc.)
2. Identify unknown variables to solve for
3. Select appropriate laws (Ohm's law, Kirchhoff's laws, etc.)
4. Solve step-by-step showing all calculations
5. Provide final answer with correct units

Format your response as JSON:
{
    "domain": "circuits",
    "known_variables": [{"name": "V", "value": 12, "unit": "V"}],
    "unknown_variables": ["I"],
    "equations_used": ["V = IR"],
    "steps": ["Step 1: ...", "Step 2: ..."],
    "final_answer": 2.0,
    "final_unit": "A",
    "explanation": "Detailed explanation..."
}""",

        "calculus": """You are an expert in calculus. Analyze the problem and:
1. Identify the function and variables involved
2. Determine what operation is needed (derivative, integral, limit)
3. Solve step-by-step showing all work
4. Provide final answer

Format your response as JSON:
{
    "domain": "calculus",
    "known_variables": [{"name": "f(x)", "value": "x^2 + 3x", "unit": "N/A"}],
    "unknown_variables": ["f'(x)"],
    "equations_used": ["d/dx(x^n) = nx^(n-1)"],
    "steps": ["Step 1: ...", "Step 2: ..."],
    "final_answer": "2x + 3",
    "final_unit": "N/A",
    "explanation": "Detailed explanation..."
}""",

        "algebra": """You are an expert in algebra. Analyze the problem and:
1. Identify known values and unknowns
2. Set up equations
3. Solve step-by-step
4. Provide final answer

Format your response as JSON:
{
    "domain": "algebra",
    "known_variables": [{"name": "a", "value": 2, "unit": "N/A"}],
    "unknown_variables": ["x"],
    "equations_used": ["ax + b = c"],
    "steps": ["Step 1: ...", "Step 2: ..."],
    "final_answer": 5.0,
    "final_unit": "N/A",
    "explanation": "Detailed explanation..."
}"""
    }

    def __init__(self, llm_provider: str = "deepseek"):
        self.llm = LLMClient(provider=llm_provider)

    def _detect_domain(self, problem_text: str) -> str:
        problem_lower = problem_text.lower()

        if any(kw in problem_lower for kw in ["force", "velocity", "acceleration", "mass", "newton", "motion", "kinetic", "potential energy", "momentum"]):
            return "mechanics"

        if any(kw in problem_lower for kw in ["voltage", "current", "resistance", "circuit", "ohm", "kirchhoff", "ampere", "volt", "ohm"]):
            return "circuits"

        if any(kw in problem_lower for kw in ["derivative", "integral", "limit", "differentiate", "integrate", "slope", "area under"]):
            return "calculus"

        return "algebra"

    def _extract_json_from_response(self, response: str) -> Dict:
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        return {
            "domain": "unknown",
            "known_variables": [],
            "unknown_variables": [],
            "equations_used": [],
            "steps": [response],
            "final_answer": None,
            "final_unit": "",
            "explanation": response
        }

    async def solve(self, problem_text: str) -> Dict[str, Any]:
        start_time = time.time()

        domain = self._detect_domain(problem_text)

        system_prompt = self.DOMAIN_PROMPTS[domain]
        user_prompt = f"Solve this engineering problem:\n\n{problem_text}"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        try:
            response = await self.llm.chat(messages)
            solution = self._extract_json_from_response(response)
        except Exception as e:
            solution = {
                "domain": domain,
                "known_variables": [],
                "unknown_variables": [],
                "equations_used": [],
                "steps": [f"Error during solving: {str(e)}"],
                "final_answer": None,
                "final_unit": "",
                "explanation": str(e),
                "error": str(e)
            }

        execution_time = time.time() - start_time

        solution["execution_time"] = execution_time
        solution["problem_text"] = problem_text
        solution["detected_domain"] = domain

        return solution

    def verify_with_sympy(self, solution: Dict, expected_answer: float, tolerance: float = 0.01) -> bool:
        if solution.get("final_answer") is None:
            return False

        try:
            calc_answer = float(solution["final_answer"])
            return abs(calc_answer - expected_answer) < tolerance
        except (ValueError, TypeError):
            return False
