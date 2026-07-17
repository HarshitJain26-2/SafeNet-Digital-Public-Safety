"use client"

import { InvestigationDataset, FraudEntity } from "@/lib/types/network"
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  GitBranch, 
  Download,
  AlertCircle,
  Network
} from "lucide-react"

interface Props {
  dataset: InvestigationDataset | null
  selectedEntityId: string | null
}

export function EntityIntelligencePanel({ dataset, selectedEntityId }: Props) {
  if (!dataset) {
    return (
      <div className="flex flex-col min-h-[400px] lg:min-h-[500px] h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
            <ShieldCheck className="h-12 w-12 text-shield-cyan/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">Entity Intelligence</h3>
          <p className="mt-2 max-w-[280px] text-sm text-shield-muted">
            Upload a dataset and select an entity to view its risk indicators and connected intelligence.
          </p>
        </div>
      </div>
    )
  }

  const entity = selectedEntityId 
    ? dataset.entities.find(e => e.id === selectedEntityId) 
    : null

  if (!entity) {
    return (
      <div className="flex flex-col min-h-[400px] lg:min-h-[500px] h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
            <Network className="h-12 w-12 text-shield-cyan/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">Select an Entity</h3>
          <p className="mt-2 max-w-[280px] text-sm text-shield-muted">
            Click on any node in the connected fraud network to inspect its intelligence profile and risk indicators.
          </p>
        </div>
      </div>
    )
  }

  const isHighRisk = entity.riskLevel === "High"
  const isMediumRisk = entity.riskLevel === "Medium"
  const isLowRisk = entity.riskLevel === "Low"

  const themeColor = isHighRisk 
    ? "text-red-400 border-red-500/30 bg-red-500/10" 
    : isMediumRisk 
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10" 
      : isLowRisk
        ? "text-green-400 border-green-500/30 bg-green-500/10"
        : "text-shield-muted border-gray-500/30 bg-gray-500/10"

  const riskLabel = isHighRisk ? "Critical Review" : isMediumRisk ? "Review Recommended" : isLowRisk ? "Lower Priority" : "Unclassified"

  return (
    <div className="flex flex-col min-h-[400px] lg:min-h-[500px] h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 overflow-y-auto custom-scrollbar sm:p-6">
      
      {/* Entity Header */}
      <div className="mb-6 border-b border-shield-cyan/10 pb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-shield-muted mb-1">
          {entity.type}
        </h3>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">{entity.label}</h2>
          <div className={`rounded px-2 py-1 text-xs font-bold ${themeColor}`}>
            {riskLabel}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-shield-muted">Risk Priority Score</p>
            <p className={`mt-1 text-xl font-bold ${isHighRisk ? "text-red-400" : isMediumRisk ? "text-amber-400" : "text-white"}`}>
              {entity.riskScore}/100
            </p>
          </div>
          <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-shield-muted">Connected Entities</p>
            <p className="mt-1 text-xl font-bold text-white">
              {entity.connectedEntitiesCount}
            </p>
          </div>
          {entity.incomingValue && (
            <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-shield-muted">Incoming Volume</p>
              <p className="mt-1 text-sm font-semibold text-white">{entity.incomingValue}</p>
            </div>
          )}
          {entity.outgoingValue && (
            <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-shield-muted">Outgoing Volume</p>
              <p className="mt-1 text-sm font-semibold text-white">{entity.outgoingValue}</p>
            </div>
          )}
          {entity.transactionCount !== undefined && (
            <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-shield-muted">Transactions</p>
              <p className="mt-1 text-sm font-semibold text-white">{entity.transactionCount}</p>
            </div>
          )}
          {entity.callFrequency !== undefined && (
            <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-shield-muted">Call Frequency</p>
              <p className="mt-1 text-sm font-semibold text-white">{entity.callFrequency}</p>
            </div>
          )}
        </div>

        {/* Risk Indicators */}
        {entity.indicators.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">
              Why Was This Entity Prioritized?
            </h3>
            <div className="space-y-2">
              {entity.indicators.map(ind => (
                <div key={ind.id} className="rounded-lg border border-shield-cyan/10 bg-shield-navy-light/30 p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    {ind.severity === "High" ? <AlertTriangle className="h-3.5 w-3.5 text-red-400" /> : <Activity className="h-3.5 w-3.5 text-amber-400" />}
                    <span className="text-xs font-semibold text-white">{ind.label}</span>
                  </div>
                  <p className="text-[11px] text-shield-muted leading-relaxed">
                    {ind.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entity Actions */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">
            Entity Actions
          </h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 rounded border border-shield-cyan/20 bg-shield-navy-light/50 px-3 py-2 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/10">
              <GitBranch className="h-4 w-4" /> View Connected Path
            </button>
            <button className="flex items-center gap-2 rounded border border-shield-cyan/20 bg-shield-navy-light/50 px-3 py-2 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/10">
              <FileText className="h-4 w-4" /> Open Evidence Timeline
            </button>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button className="flex justify-center items-center gap-1.5 rounded bg-shield-cyan/10 px-3 py-2 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/20">
                Mark for Review
              </button>
              <button className="flex justify-center items-center gap-1.5 rounded bg-shield-cyan/10 px-3 py-2 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/20">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
            {isHighRisk && (
              <button className="mt-1 flex justify-center items-center gap-1.5 rounded border border-red-500/30 bg-red-500/20 px-3 py-2 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/30">
                Escalate for authorized account review
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
