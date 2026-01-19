from pydantic import BaseModel, Field
from typing import List, Literal


class PromptInput(BaseModel):
    prompt: str = Field(..., min_length=10, description="Original user prompt")
    use_case: Literal["chatbot", "coding", "education", "general"]
    risk_preference: Literal["low", "medium", "high"]


class RiskAssessment(BaseModel):
    hallucination_risk: Literal["low", "medium", "high"]
    reasons: List[str]


class OptimizedPrompt(BaseModel):
    optimized_prompt: str
    explanation: List[str]
    risk_assessment: RiskAssessment
