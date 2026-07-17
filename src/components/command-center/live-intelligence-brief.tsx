"use client"

import { CommandCase } from "@/lib/types/command-center"
import { ShieldAlert, Map, Clock, AlertCircle, FileText, CheckCircle2, Crosshair, ArrowRight, Network } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  selectedCase: CommandCase | null
  onOpenInvestigation: (id: string) => void
}

export function LiveIntelligenceBrief({ selectedCase, onOpenInvestigation }: Props) {
  
  if (!selectedCase) {
    return (
      <div className="flex flex-col h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5 text-center justify-center items-center">
        <div className="mb-4 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
          <ShieldAlert className="h-10 w-10 text-shield-cyan/50" />
        </div>
        <h3 className="text-sm font-semibold text-white">Live Intelligence Brief</h3>
        <p className="mt-2 text-xs text-shield-muted max-w-[200px]">
          Select an active case or region from the queue or map to inspect intelligence.
        </p>
      </div>
    )
  }

  const isCritical = selectedCase.riskLevel === "Critical"
  const themeColor = isCritical ? "text-red-400" : selectedCase.riskLevel === "High" ? "text-amber-400" : "text-yellow-400"
  const themeBg = isCritical ? "bg-red-500/10 border-red-500/20" : selectedCase.riskLevel === "High" ? "bg-amber-500/10 border-amber-500/20" : "bg-yellow-500/10 border-yellow-500/20"

  return (
    <div className="flex flex-col h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-4 sm:p-5 shadow-xl shadow-shield-cyan/5 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2 mb-4 border-b border-shield-cyan/10 pb-3">
        <ShieldAlert className="h-4 w-4 text-shield-cyan" /> Live Intelligence Brief
      </h2>

      <div className="flex-1 space-y-5">
        
        {/* Top Case Context */}
        <div>
          <div className="text-[10px] font-mono text-shield-muted mb-1">{selectedCase.id}</div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white leading-tight">{selectedCase.location}</h3>
            <div className={`flex flex-col items-end rounded px-2 py-1 border shrink-0 ${themeBg}`}>
              <span className={`text-lg font-bold leading-none ${themeColor}`}>{selectedCase.riskScore}</span>
              <span className={`text-[9px] uppercase font-bold mt-0.5 ${themeColor}`}>{selectedCase.riskLevel}</span>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded border border-shield-cyan/10 bg-shield-navy/40 p-2">
              <span className="text-shield-muted block mb-0.5">Primary Threat:</span>
              <span className="text-white font-semibold">{selectedCase.threatCategory}</span>
            </div>
            <div className="rounded border border-shield-cyan/10 bg-shield-navy/40 p-2">
              <span className="text-shield-muted block mb-0.5">Reported Cases:</span>
              <span className="text-white font-semibold flex justify-between">
                {selectedCase.reportedCases} <span className={selectedCase.trend === "Increasing" ? "text-red-400" : "text-shield-cyan"}>{selectedCase.trend}</span>
              </span>
            </div>
          </div>
        </div>

        {/* AI-Assisted Indicators */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-shield-muted mb-2 flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" /> AI-Assisted Indicators
          </h4>
          <ul className="space-y-1.5">
            {selectedCase.indicators.map((ind, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/90">
                <AlertCircle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${themeColor}`} />
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-shield-muted mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" /> Recommended Analyst Actions
          </h4>
          <ul className="space-y-1.5 bg-shield-navy/30 rounded border border-shield-cyan/10 p-3">
            {selectedCase.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-shield-muted">
                <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-shield-cyan/50" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Footer Notice & Actions */}
      <div className="mt-5 pt-4 border-t border-shield-cyan/10 space-y-4">
        
        <div className="rounded border border-shield-cyan/10 bg-shield-navy/60 p-2.5 text-[9px] text-shield-muted leading-relaxed">
          <span className="font-semibold text-white block mb-0.5">PRELIMINARY INTELLIGENCE:</span>
          AI-generated intelligence is preliminary decision support and must be validated by authorized investigators before operational action.
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => onOpenInvestigation(selectedCase.id)}
            className="w-full bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90 font-semibold"
          >
            <FileText className="mr-2 h-4 w-4" /> Open Investigation
          </Button>
          <Button 
            variant="outline"
            className="w-full border-shield-cyan/20 bg-transparent text-shield-cyan hover:bg-shield-cyan/10 hover:text-white"
          >
            <Network className="mr-2 h-4 w-4" /> View Connected Network
          </Button>
        </div>
      </div>

    </div>
  )
}
