from pydantic_ai import Agent
from app.schemas import PromptInput, OptimizedPrompt, RiskAssessment
from app.config import MODEL_NAME
import logging

logging.basicConfig(level=logging.INFO)

SYSTEM_PROMPT = """
You are GuardPrompt, an AI agent designed to analyze and optimize user prompts
to reduce hallucinations, ambiguity, and unsafe behavior in large language models.

Your responsibilities:
1. Analyze the prompt for hallucination risk.
2. Apply strict guardrails and constraints.
3. Rewrite the prompt to be safer, clearer, and more reliable.
4. Explain the changes you made.

Always be precise and conservative.
"""

guardprompt_agent = Agent(
    model=MODEL_NAME,
    system_prompt=SYSTEM_PROMPT,
    retries=2,
)


def optimize_prompt(input_data: PromptInput) -> OptimizedPrompt:
    """
    Core GuardPrompt logic:
    - Analyze risk
    - Optimize prompt
    - Return structured output
    """

    user_message = f"""
Original Prompt:
{input_data.prompt}

Use Case:
{input_data.use_case}

Risk Preference:
{input_data.risk_preference}

Tasks:
1. Determine hallucination risk (low, medium, high).
2. Rewrite the prompt with safety guardrails.
3. Explain why the changes reduce hallucination.
"""

    try:
        result = guardprompt_agent.run(
            user_message,
            result_type=OptimizedPrompt
        )
        return result.data

    except Exception as e:
        logging.error(f"GuardPrompt failed: {e}")

        # Fallback safe prompt
        fallback_prompt = f"""
You are a cautious AI assistant.
Only answer using verified information.
If unsure, say "I don't know".

Task:
{input_data.prompt}
"""

        return OptimizedPrompt(
            optimized_prompt=fallback_prompt,
            explanation=[
                "Fallback prompt used due to processing error.",
                "Strict safety constraints applied."
            ],
            risk_assessment=RiskAssessment(
                hallucination_risk="high",
                reasons=["Agent execution failure"]
            )
        )
