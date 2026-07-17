"use client"

import { InvestigationDataset } from "@/lib/types/network"
import { 
  AlertCircle, 
  Clock, 
  GitMerge, 
  ShieldAlert,
  ArrowRight,
  Info,
  PhoneCall,
  Activity
} from "lucide-react"

interface Props {
  dataset: InvestigationDataset | null
  onFocusEntity: (id: string) => void
}

export function InvestigationDetails({ dataset, onFocusEntity }: Props) {
  if (!dataset) return null

  return (
    <div className="space-y-8 pb-12 mt-6">
      
      {/* Investigation Summary */}
      <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
          <Activity className="h-4 w-4" /> AI-Assisted Investigation Summary
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 text-sm text-white/90 leading-relaxed">
            <p>{dataset.summary.overview}</p>
            <div className="rounded border border-shield-cyan/10 bg-shield-navy/40 p-4">
              <p className="mb-2 text-xs font-medium text-shield-cyan">Key Patterns Observed:</p>
              <ul className="space-y-1.5 text-xs">
                {dataset.summary.keyPatterns.map((pattern, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-shield-cyan/50" />
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-shield-muted/60 italic flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Prototype AI-assisted summary — investigator verification required
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center lg:text-left h-fit">
            <div className="rounded bg-shield-navy/40 p-3 border border-shield-cyan/10">
              <p className="text-xl font-bold text-white">{dataset.summary.totalEntities}</p>
              <p className="text-[10px] uppercase text-shield-muted">Entities</p>
            </div>
            <div className="rounded bg-shield-navy/40 p-3 border border-shield-cyan/10">
              <p className="text-xl font-bold text-white">{dataset.summary.totalRelationships}</p>
              <p className="text-[10px] uppercase text-shield-muted">Relationships</p>
            </div>
            <div className="rounded bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-xl font-bold text-red-400">{dataset.summary.highPriorityEntities}</p>
              <p className="text-[10px] uppercase text-red-400/80">High Priority</p>
            </div>
            <div className="rounded bg-shield-navy/40 p-3 border border-shield-cyan/10">
              <p className="text-xl font-bold text-white">{dataset.summary.totalAnalyzedValue}</p>
              <p className="text-[10px] uppercase text-shield-muted">Analyzed Value</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evidence Timeline */}
        <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
              <Clock className="h-4 w-4" /> Evidence Timeline
            </h3>
            <span className="text-xs text-shield-cyan/70">Top 5 Events</span>
          </div>
          
          <div className="relative border-l border-shield-cyan/20 ml-3 pl-6 space-y-6">
            {dataset.timeline.map(event => (
              <div key={event.id} className="relative">
                <span className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-shield-navy ring-2 ring-shield-navy-light ${event.type === 'Alert' ? 'ring-red-400/50' : 'ring-shield-cyan/50'}`}>
                  {event.type === "Call" && <PhoneCall className="h-2.5 w-2.5 text-shield-cyan" />}
                  {event.type === "Transaction" && <Activity className="h-2.5 w-2.5 text-shield-cyan" />}
                  {event.type === "Alert" && <ShieldAlert className="h-2.5 w-2.5 text-red-400" />}
                </span>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-shield-cyan">{event.timestamp}</span>
                    <span className="text-[10px] rounded bg-shield-navy px-1.5 py-0.5 text-shield-muted border border-shield-cyan/10">{event.source}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{event.description}</p>
                  
                  {(event.entityId || event.amount || event.riskIndicator) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.entityId && (
                        <button 
                          onClick={() => onFocusEntity(event.entityId!)}
                          className="rounded border border-shield-cyan/20 bg-shield-cyan/5 px-2 py-1 text-xs font-mono text-shield-cyan transition-colors hover:bg-shield-cyan/20"
                        >
                          {event.entityId}
                        </button>
                      )}
                      {event.amount && <span className="rounded bg-shield-navy/60 px-2 py-1 text-xs font-medium text-white">{event.amount}</span>}
                      {event.riskIndicator && <span className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400 border border-red-500/20">{event.riskIndicator}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Priority Analysis & Clusters */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Top Entities Requiring Review
            </h3>
            <div className="space-y-3">
              {dataset.entities.filter(e => e.riskLevel === "High").sort((a, b) => b.riskScore - a.riskScore).slice(0, 3).map((entity) => (
                <div key={entity.id} className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-red-400 w-6 text-right">{entity.riskScore}</div>
                    <div>
                      <div className="text-sm font-semibold text-white">{entity.id}</div>
                      <div className="text-xs text-shield-muted">{entity.type}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onFocusEntity(entity.id)}
                    className="text-xs text-shield-cyan hover:text-shield-cyan/80 font-medium"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
              <GitMerge className="h-4 w-4" /> Detected Network Clusters
            </h3>
            <div className="space-y-3">
              {dataset.clusters.map(cluster => (
                <div key={cluster.id} className="rounded-lg border border-shield-cyan/20 bg-shield-navy/40 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm text-white">{cluster.label}</div>
                    <div className={`text-[10px] rounded px-1.5 py-0.5 font-bold ${
                      cluster.riskLevel === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {cluster.riskLevel} Risk
                    </div>
                  </div>
                  <p className="text-xs text-shield-muted mb-3 leading-relaxed">{cluster.pattern}</p>
                  <div className="flex items-center justify-between border-t border-shield-cyan/10 pt-3">
                    <div className="flex gap-4">
                      <span className="text-[10px] text-shield-muted"><strong className="text-white">{cluster.entityCount}</strong> Entities</span>
                      {cluster.totalValue && <span className="text-[10px] text-shield-muted"><strong className="text-white">{cluster.totalValue}</strong> Value</span>}
                    </div>
                    <button 
                      onClick={() => onFocusEntity(cluster.centralEntityId)}
                      className="text-[10px] uppercase font-bold text-shield-cyan hover:text-shield-cyan/80 transition-colors"
                    >
                      Focus Central Node
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-6 shadow-xl shadow-shield-cyan/5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
          <Info className="h-4 w-4" /> Recommended Investigation Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataset.recommendations.map(rec => (
            <div key={rec.id} className="flex flex-col justify-between rounded-lg border border-shield-cyan/20 bg-shield-navy/40 p-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2 w-2 rounded-full ${rec.priority === "High" ? "bg-red-400" : "bg-amber-400"}`} />
                  <span className="text-xs font-semibold text-white">{rec.action}</span>
                </div>
                <p className="text-xs text-shield-muted leading-relaxed">{rec.reason}</p>
              </div>
              {rec.targetEntityId && (
                <button 
                  onClick={() => onFocusEntity(rec.targetEntityId!)}
                  className="mt-4 self-start rounded border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-xs font-medium text-shield-cyan hover:bg-shield-cyan/20"
                >
                  Review {rec.targetEntityId}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="rounded bg-shield-navy/60 p-4 text-xs text-shield-muted/60 text-center flex items-center justify-center gap-2 border border-shield-cyan/5">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <p className="max-w-4xl leading-relaxed">
          ShieldAI provides AI-assisted network analysis based on submitted data. Risk indicators and graph relationships do not establish criminal activity. All findings require verification by authorized investigators and applicable legal procedures.
        </p>
      </div>

    </div>
  )
}
