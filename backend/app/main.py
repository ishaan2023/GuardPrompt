from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PromptInput, OptimizedPrompt
from app.agent import optimize_prompt

app = FastAPI(
    title="GuardPrompt API",
    description="Adaptive LLM Prompt Optimization Platform",
    version="1.0.0",
)

# 🔥 CORS CONFIG (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "GuardPrompt backend running"}


@app.post(
    "/optimize-prompt",
    response_model=OptimizedPrompt,
    tags=["Prompt Optimization"],
)
def optimize_prompt_endpoint(input_data: PromptInput):
    return optimize_prompt(input_data)
