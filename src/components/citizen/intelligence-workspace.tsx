"use client"

import { ThreatVerdict } from "@/lib/types/citizen"
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Copy, FileText, Activity, ShieldCheck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  verdict: ThreatVerdict | null
  onGenerateDraft: () => void
}

export function IntelligenceWorkspace({ verdict, onGenerateDraft }: Props) {
  if (!verdict) {
    return (
      <div className="flex flex-col min-h-[400px] lg:min-h-[560px] h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
            <Activity className="h-12 w-12 text-shield-cyan/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">Intelligence Awaiting Analysis</h3>
          <p className="mt-2 max-w-[280px] text-sm text-shield-muted">
            Threat score, explainable evidence, detected entities, and safety recommendations will appear here after analysis.
          </p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "text-shield-critical bg-shield-critical/10 border-shield-critical/20"
      case "High": return "text-shield-high-risk bg-shield-high-risk/10 border-shield-high-risk/20"
      case "Medium": return "text-shield-warning bg-shield-warning/10 border-shield-warning/20"
      case "Informational": return "text-shield-cyan bg-shield-cyan/10 border-shield-cyan/20"
      default: return "text-shield-muted bg-shield-navy border-shield-cyan/10"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical": return <XCircle className="h-4 w-4 text-shield-critical" />
      case "High": return <AlertTriangle className="h-4 w-4 text-shield-high-risk" />
      case "Medium": return <AlertTriangle className="h-4 w-4 text-shield-warning" />
      case "Informational": return <Info className="h-4 w-4 text-shield-cyan" />
      default: return <Info className="h-4 w-4 text-shield-muted" />
    }
  }

  return (
    <div className="flex flex-col gap-4 h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
      
      {/* Explainable Evidence */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shield-muted">
          <ShieldAlert className="h-4 w-4 text-shield-cyan" />
          Explainable Evidence
        </h3>
        <div className="space-y-2">
          {verdict.evidence.map((item, idx) => (
            <div key={idx} className="flex gap-3 rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <div className="shrink-0 mt-0.5">{getSeverityIcon(item.severity)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-shield-muted">{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Entities */}
      {verdict.entities.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shield-muted">
            <Activity className="h-4 w-4 text-shield-cyan" />
            Detected Entities
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {verdict.entities.map((entity, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-shield-cyan/10 bg-shield-navy/30 p-2.5">
                <div>
                  <div className="text-[10px] uppercase text-shield-muted/70">{entity.type}</div>
                  <div className="text-xs font-medium text-white truncate max-w-[120px]" title={entity.value}>{entity.value}</div>
                </div>
                {entity.copyable && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(entity.value)}
                    className="p-1.5 text-shield-muted hover:text-white hover:bg-shield-navy rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Safety Recommendations */}
      <div className="mt-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shield-muted">
          <ShieldCheck className="h-4 w-4 text-shield-safe" />
          Safety Recommendations
        </h3>
        <ul className="space-y-2 rounded-lg border border-shield-safe/20 bg-shield-safe/5 p-4">
          {verdict.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-shield-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-shield-safe" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generate Complaint Draft Action */}
      <div className="mt-auto pt-6 border-t border-shield-cyan/10">
        <Button 
          onClick={onGenerateDraft}
          variant="outline"
          className="w-full border-shield-cyan/30 bg-shield-cyan/5 py-6 text-sm font-semibold text-white hover:bg-shield-cyan/10 hover:border-shield-cyan/50"
        >
          <FileText className="mr-2 h-4 w-4 text-shield-cyan" />
          Generate Complaint Draft
        </Button>
      </div>

    </div>
  )
}
