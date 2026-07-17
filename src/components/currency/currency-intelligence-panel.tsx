"use client"

import { CurrencyAnalysisResult, SecurityFeature } from "@/lib/types/currency"
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, Info, ArrowRight, ShieldAlert } from "lucide-react"

interface Props {
  verdict: CurrencyAnalysisResult | null
  onReset: () => void
}

export function CurrencyIntelligencePanel({ verdict, onReset }: Props) {
  if (!verdict) {
    return (
      <div className="flex flex-col min-h-[400px] lg:min-h-[500px] h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
            <ShieldCheck className="h-12 w-12 text-shield-cyan/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">Intelligence Awaiting Analysis</h3>
          <p className="mt-2 max-w-[280px] text-sm text-shield-muted">
            Authenticity risk, visible security-feature observations, confidence information, and recommended actions will appear here.
          </p>
        </div>
      </div>
    )
  }

  // Determine styling based on risk level
  const isHighRisk = verdict.riskLevel === "High Risk"
  const isReview = verdict.riskLevel === "Review Recommended"
  const isLowRisk = verdict.riskLevel === "Low Risk"

  const themeColor = isHighRisk 
    ? "text-red-400 border-red-500/30 bg-red-500/10" 
    : isReview 
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10" 
      : "text-green-400 border-green-500/30 bg-green-500/10"

  const strokeColor = isHighRisk ? "#f87171" : isReview ? "#fbbf24" : "#4ade80"

  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (verdict.confidenceScore / 100) * circumference

  const renderFeatureStatusIcon = (status: SecurityFeature["status"]) => {
    switch (status) {
      case "Consistent":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "Review":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case "Inconsistency":
        return <ShieldAlert className="h-4 w-4 text-red-400" />
      case "Unknown":
        return <Info className="h-4 w-4 text-shield-muted" />
    }
  }

  return (
    <div className="flex flex-col gap-5 h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
      
      {/* Result Summary */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-shield-muted">
          Authenticity Risk Assessment
        </h3>
        
        <div className={`relative flex items-center justify-between overflow-hidden rounded-xl border ${themeColor} p-4`}>
          <div className="z-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">{verdict.riskLevel}</span>
            </div>
            <p className="mt-1 text-xs opacity-80">
              Prototype AI-assisted screening result
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="-rotate-90 transform" width="64" height="64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="opacity-20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={strokeColor}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-bold">{verdict.confidenceScore}%</span>
            </div>
            <span className="mt-1 text-[10px] uppercase opacity-70">Confidence</span>
          </div>
        </div>
      </div>

      {/* Security Feature Checklist */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">
          Security Features Evaluated
        </h3>
        <div className="space-y-2">
          {verdict.features.map((feature, idx) => (
            <div key={idx} className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {renderFeatureStatusIcon(feature.status)}
                  <span className="text-sm font-medium text-white">{feature.name}</span>
                </div>
                <div className="rounded bg-shield-navy-light/50 px-2 py-0.5 text-[10px] text-shield-muted">
                  {feature.status}
                </div>
              </div>
              <p className="mt-2 text-xs text-shield-muted leading-relaxed">
                {feature.observation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation Panel */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">
          Why This Assessment?
        </h3>
        <ul className="space-y-2">
          {verdict.evidence.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-white">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-shield-cyan/70" />
              <span className="text-sm text-shield-muted leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation Card */}
      <div className={`mt-2 rounded-lg border ${themeColor} p-4`}>
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4" /> Recommended Action
        </div>
        <p className="text-sm opacity-90 leading-relaxed mb-4">
          {isLowRisk && "No major visible inconsistencies were identified. Continue standard verification procedures."}
          {isReview && "Some security features could not be evaluated clearly. Capture both sides in better lighting or request authorized manual verification."}
          {isHighRisk && "Potential visible inconsistencies were identified. Do not rely solely on this result. Follow authorized verification and reporting procedures."}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button 
            onClick={onReset}
            className="flex-1 rounded border border-current bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-current hover:bg-opacity-10 transition-colors"
          >
            {isReview ? "Upload Clearer Image" : "Scan Again"}
          </button>
          {!isLowRisk && (
            <button className="flex-1 rounded border border-current bg-current px-3 py-1.5 text-xs font-medium text-shield-navy hover:bg-opacity-90 transition-colors">
              {isHighRisk ? "Report Suspicious Currency" : "Request Manual Verification"}
            </button>
          )}
        </div>
      </div>

      {/* Responsible AI Notice */}
      <div className="mt-2 rounded bg-shield-navy/40 p-3 text-[10px] text-shield-muted/60 leading-relaxed text-center">
        <AlertCircle className="inline-block h-3 w-3 mr-1 -mt-0.5" />
        ShieldAI provides AI-assisted preliminary screening based on visible image features. This result is not a legal determination of currency authenticity. Use authorized verification procedures when required.
      </div>

    </div>
  )
}
