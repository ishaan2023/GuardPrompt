"use client";

import { useState } from "react";
import {
  Shield,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ChevronDown
} from "lucide-react";

type Result = {
  optimized_prompt: string;
  explanation: string[];
  risk_assessment: {
    hallucination_risk: "low" | "medium" | "high";
    reasons: string[];
  };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [useCase, setUseCase] = useState("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8002/optimize-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          use_case: useCase,
          risk_preference: "low",
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong while analyzing the prompt. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.optimized_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="w-4 h-4 mr-2" />;
      case "medium": return <AlertTriangle className="w-4 h-4 mr-2" />;
      case "low": return <CheckCircle2 className="w-4 h-4 mr-2" />;
      default: return <Info className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GuardPrompt</h1>
            <p className="text-xs text-gray-500 font-medium">Enterprise LLM Security</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        {/* Intro */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Make your prompts <span className="text-violet-600">safe</span> and <span className="text-violet-600">effective</span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
            Reduce hallucinations and unsafe outputs. Paste your prompt below to get an optimized, safer version with clear explanations.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
          <div className="p-6 space-y-6">

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                <span>Your Prompt</span>
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-40 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none bg-gray-50/50 transition-all font-mono text-sm leading-relaxed"
                  placeholder="e.g. Tell me everything about black holes and make up details if needed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={4000}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                  {prompt.length} / 4,000
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Use Case</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-violet-500 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <select
                  className="w-full appearance-none border border-gray-200 rounded-xl py-3 pl-10 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer font-medium text-gray-700"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="education">Education</option>
                  <option value="chatbot">Customer Support Chatbot</option>
                  <option value="coding">Coding Assistant</option>
                  <option value="creative">Creative Writing</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2
                ${loading
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-violet-600 hover:bg-violet-700 hover:-translate-y-0.5"}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  Analyze & Guard
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
              <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center ${getRiskColor(result.risk_assessment.hallucination_risk)}`}>
                {getRiskIcon(result.risk_assessment.hallucination_risk)}
                {result.risk_assessment.hallucination_risk.charAt(0).toUpperCase() + result.risk_assessment.hallucination_risk.slice(1)} Risk
              </div>
            </div>

            <div className="space-y-6">
              {/* Optimized Prompt Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-violet-50 bg-violet-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-violet-700 font-semibold">
                    <Sparkles className="w-5 h-5" />
                    Optimized Prompt
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-violet-200 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 bg-slate-50">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed overflow-x-auto">
                    {result.optimized_prompt}
                  </pre>
                </div>
              </div>

              {/* Improvements Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    What We Improved
                  </h4>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {result.explanation.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 min-w-[20px]">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                        </div>
                        <span className="text-gray-600 leading-relaxed text-sm">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
