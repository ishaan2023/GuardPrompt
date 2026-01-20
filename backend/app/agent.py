from app.schemas import OptimizedPrompt, RiskAssessment, PromptInput
from typing import List


def detect_risk(prompt: str) -> tuple[str, List[str]]:
    prompt_lower = prompt.lower()

    high_risk_keywords = [
        "medical", "cure", "diagnose", "treatment",
        "legal", "lawsuit", "court",
        "financial advice", "invest", "guaranteed returns",
    ]

    medium_risk_keywords = [
        "predict", "forecast", "debate", "controversial",
        "uncertain", "future",
    ]

    for word in high_risk_keywords:
        if word in prompt_lower:
            return "high", [
                "Prompt requests medical, legal, or financial advice"
            ]

    for word in medium_risk_keywords:
        if word in prompt_lower:
            return "medium", [
                "Prompt involves uncertainty, prediction, or speculation"
            ]

    return "low", [
        "Prompt is informational and low risk"
    ]


def optimize_prompt(input_data: PromptInput) -> OptimizedPrompt:
    prompt = input_data.prompt
    use_case = input_data.use_case
    risk_preference = input_data.risk_preference

    # 🔍 Detect actual risk from content
    detected_risk, reasons = detect_risk(prompt)

    optimized_prompt = f"""
You are an expert {use_case} AI assistant.

Follow these rules:
- Be clear, accurate, and structured
- Avoid hallucinations
- Adjust response depth based on USER RISK PREFERENCE: {risk_preference}
- Be extra cautious if DETECTED RISK LEVEL is high

DETECTED RISK LEVEL:
{detected_risk}

USER PROMPT:
{prompt}
""".strip()

    explanation = [
        "Added explicit role definition to guide the model",
        f"Prompt tailored for the '{use_case}' use case",
        f"Response depth controlled by user risk preference: '{risk_preference}'",
        f"System detected overall hallucination risk as '{detected_risk}'",
    ]

    return OptimizedPrompt(
        optimized_prompt=optimized_prompt,
        explanation=explanation,
        risk_assessment=RiskAssessment(
            hallucination_risk=detected_risk,
            reasons=reasons,
        ),
    )
