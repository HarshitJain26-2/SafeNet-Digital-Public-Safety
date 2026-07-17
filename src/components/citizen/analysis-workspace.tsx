"use client"

import { AnalysisState, ThreatVerdict } from "@/lib/types/citizen"
import { ShieldCheck, Loader2, Info, CheckCircle2 } from "lucide-react"

interface Props {
  state: AnalysisState
  verdict: ThreatVerdict | null
}

const STEPS = [
  { id: "validating", label: "Validating Input" },
  { id: "extracting", label: "Extracting Intelligence" },
  { id: "analyzing", label: "Analyzing Risk Signals" },
  { id: "classifying", label: "Classifying Threat" },
  { id: "recommending", label: "Generating Safety Recommendations" }
]

export function AnalysisWorkspace({ state, verdict }: Props) {
  const isIdle = state === "idle"
  const isAnalyzing = state !== "idle" && state !== "complete" && state !== "error"
  const isComplete = state === "complete" && verdict !== null

  return (
    <div className="flex flex-col min-h-[400px] lg:min-h-[560px] h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 p-5 shadow-2xl shadow-shield-cyan/5 backdrop-blur-sm sm:p-6">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-shield-cyan/10 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-shield-cyan" />
          <h2 className="text-lg font-semibold text-white">AI Analysis Engine</h2>
        </div>
        <div className="flex items-center gap-2">
          {isIdle && <span className="flex items-center gap-1.5 rounded-full border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-0.5 text-[10px] font-medium text-shield-cyan"><span className="h-1.5 w-1.5 rounded-full bg-shield-cyan" /> Ready</span>}
          {isAnalyzing && <span className="flex items-center gap-1.5 rounded-full border border-shield-warning/20 bg-shield-warning/10 px-2 py-0.5 text-[10px] font-medium text-shield-warning"><Loader2 className="h-3 w-3 animate-spin" /> Processing</span>}
          {isComplete && <span className="flex items-center gap-1.5 rounded-full border border-shield-safe/20 bg-shield-safe/10 px-2 py-0.5 text-[10px] font-medium text-shield-safe"><CheckCircle2 className="h-3 w-3" /> Complete</span>}
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1">
        {/* Idle State */}
        {isIdle && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
              <ShieldCheck className="h-12 w-12 text-shield-cyan/50" />
            </div>
            <h3 className="text-lg font-semibold text-white">ShieldAI Intelligence Engine Ready</h3>
            <p className="mt-2 max-w-sm text-sm text-shield-muted">
              Submit suspicious content to receive explainable risk intelligence, detected indicators, and recommended safety actions.
            </p>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-shield-cyan" />
              <p className="mt-4 text-sm font-medium text-white">Analyzing Threat Intelligence...</p>
            </div>
            <div className="space-y-3">
              {STEPS.map((step, index) => {
                const stepIndex = STEPS.findIndex(s => s.id === state)
                const isPast = stepIndex > index
                const isCurrent = step.id === state
                
                return (
                  <div key={step.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${isCurrent ? "border-shield-cyan/30 bg-shield-cyan/10" : isPast ? "border-shield-safe/20 bg-shield-safe/5" : "border-shield-cyan/5 bg-shield-navy/20"}`}>
                    {isPast ? <CheckCircle2 className="h-4 w-4 text-shield-safe" /> : isCurrent ? <Loader2 className="h-4 w-4 animate-spin text-shield-cyan" /> : <div className="h-4 w-4 rounded-full border-2 border-shield-muted/30" />}
                    <span className={`text-xs font-medium ${isCurrent ? "text-shield-cyan" : isPast ? "text-shield-safe/80" : "text-shield-muted/50"}`}>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Complete State */}
        {isComplete && verdict && (
          <div className="flex h-full flex-col">
            <div className="mb-6 text-center">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-shield-muted/70">Analysis Verdict</div>
              <h3 className={`text-3xl font-bold ${
                verdict.level === "Critical" || verdict.level === "High-Risk" ? "text-shield-critical" :
                verdict.level === "Suspicious" || verdict.level === "Caution" ? "text-shield-warning" :
                "text-shield-safe"
              }`}>
                {verdict.level}
              </h3>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-4 text-center">
                <div className="text-[10px] uppercase text-shield-muted">Threat Score</div>
                <div className="mt-1 text-2xl font-bold text-white">{verdict.score}<span className="text-sm text-shield-muted">/100</span></div>
              </div>
              <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-4 text-center">
                <div className="text-[10px] uppercase text-shield-muted">Model Confidence</div>
                <div className="mt-1 text-2xl font-bold text-white">{verdict.confidence}<span className="text-sm text-shield-muted">%</span></div>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-shield-cyan/20 bg-shield-cyan/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-shield-cyan" />
                <span className="text-xs font-semibold uppercase text-shield-cyan">AI Risk Assessment</span>
              </div>
              <p className="text-sm leading-relaxed text-shield-muted">{verdict.assessment}</p>
            </div>
            
            <div className="mt-auto flex items-center justify-between border-t border-shield-cyan/10 pt-4 text-[10px] text-shield-muted">
              <span>Category: <strong className="text-white">{verdict.category}</strong></span>
              <span>Analysis completed at {new Date(verdict.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
