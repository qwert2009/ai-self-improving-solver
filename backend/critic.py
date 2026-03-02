import time
import json
import re
from typing import Dict, Any, List, Optional
from backend.llm_client import LLMClient


class CriticAgent:
    CRITIC_SYSTEM_PROMPT = """You are an expert critic and validator for engineering problem solutions.
Your task is to:
1. Review the provided solution for errors and inconsistencies
2. Check for:
   - Logical inconsistencies in reasoning
   - Missing or incorrect assumptions
   - Unit errors (dimensional analysis)
   - Mathematical calculation mistakes
   - Incomplete explanations
3. If errors are found, re-solve the problem using a different approach
4. Compare both solutions and provide a confidence score

Respond in JSON format:
{
    "issues_found": [
        {"type": "logical|mathematical|unit|assumption", "description": "...", "severity": "low|medium|high"}
    ],
    "original_solution_valid": true/false,
    "revised_solution": {
        "steps": ["..."],
        "final_answer": 5.0,
        "final_unit": "m/s²",
        "explanation": "..."
    },
    "comparison": "Comparison of both approaches...",
    "confidence_score": 0.95,
    "improvement_made": true/false,
    "recommendation": "Use original|Use revised|Both equivalent"
}"""

    def __init__(self, llm_provider: str = "deepseek"):
        self.llm = LLMClient(provider=llm_provider)

    def _check_units(self, solution: Dict) -> List[Dict]:
        issues = []
        known_vars = solution.get("known_variables", [])
        final_unit = solution.get("final_unit", "")

        unit_mapping = {
            "m/s²": ["acceleration"],
            "m/s": ["velocity", "speed"],
            "N": ["force"],
            "kg": ["mass"],
            "V": ["voltage", "potential"],
            "A": ["current"],
            "Ω": ["resistance"],
            "J": ["energy", "work"],
            "W": ["power"]
        }

        return issues

    def _check_mathematical_consistency(self, solution: Dict) -> List[Dict]:
        issues = []
        steps = solution.get("steps", [])

        for i, step in enumerate(steps):
            if "/ 0" in step or "/0" in step:
                issues.append({
                    "type": "mathematical",
                    "description": f"Potential division by zero in step {i+1}",
                    "severity": "high"
                })

            if "mass" in step.lower() and "- " in step:
                issues.append({
                    "type": "mathematical",
                    "description": f"Negative mass mentioned in step {i+1}",
                    "severity": "high"
                })

        return issues

    def _extract_json_from_response(self, response: str) -> Dict:
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        return {
            "issues_found": [],
            "original_solution_valid": True,
            "revised_solution": {
                "steps": ["No revision needed"],
                "final_answer": None,
                "final_unit": "",
                "explanation": response
            },
            "comparison": "Original solution appears valid",
            "confidence_score": 0.7,
            "improvement_made": False,
            "recommendation": "Use original"
        }

    async def critique(self, problem_text: str, original_solution: Dict) -> Dict[str, Any]:
        start_time = time.time()

        unit_issues = self._check_units(original_solution)
        math_issues = self._check_mathematical_consistency(original_solution)
        automated_issues = unit_issues + math_issues

        critique_prompt = f"""Problem: {problem_text}

Original Solution:
{json.dumps(original_solution, indent=2, ensure_ascii=False)}

Automated checks found these issues:
{json.dumps(automated_issues, indent=2, ensure_ascii=False) if automated_issues else "No automated issues detected"}

Please review this solution thoroughly and provide your critique in the specified JSON format."""

        messages = [
            {"role": "system", "content": self.CRITIC_SYSTEM_PROMPT},
            {"role": "user", "content": critique_prompt}
        ]

        try:
            response = await self.llm.chat(messages, temperature=0.5)
            critique_result = self._extract_json_from_response(response)
        except Exception as e:
            critique_result = {
                "issues_found": automated_issues,
                "original_solution_valid": True,
                "revised_solution": {
                    "steps": [f"Error during critique: {str(e)}"],
                    "final_answer": original_solution.get("final_answer"),
                    "final_unit": original_solution.get("final_unit"),
                    "explanation": str(e)
                },
                "comparison": "Critique failed",
                "confidence_score": 0.5,
                "improvement_made": False,
                "recommendation": "Use original"
            }

        all_issues = critique_result.get("issues_found", []) + automated_issues
        critique_result["issues_found"] = all_issues

        execution_time = time.time() - start_time

        critique_result["execution_time"] = execution_time
        critique_result["original_solution"] = original_solution
        critique_result["problem_text"] = problem_text

        return critique_result

    def calculate_confidence(self, critique_result: Dict) -> float:
        base_confidence = critique_result.get("confidence_score", 0.7)

        issues = critique_result.get("issues_found", [])
        high_severity_count = sum(1 for i in issues if i.get("severity") == "high")
        medium_severity_count = sum(1 for i in issues if i.get("severity") == "medium")

        penalty = (high_severity_count * 0.2) + (medium_severity_count * 0.1)
        adjusted_confidence = max(0.0, min(1.0, base_confidence - penalty))

        return adjusted_confidence
