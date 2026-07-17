"use client"

import { CrimeHotspot } from "@/lib/types/geospatial"
import { Map, AlertTriangle, ShieldAlert, BarChart3, TrendingUp, TrendingDown, Minus, Target, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  selectedHotspot: CrimeHotspot | null
  onOpenReport: () => void
}

export function RegionalIntelligencePanel({ selectedHotspot, onOpenReport }: Props) {
  
  if (!selectedHotspot) {
    return (
      <div className="flex flex-col h-full min-h-[400px] lg:min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="mb-6 rounded-full bg-shield-cyan/5 p-4 ring-1 ring-shield-cyan/20">
            <Map className="h-12 w-12 text-shield-cyan/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">Regional Intelligence</h3>
          <p className="mt-2 max-w-[280px] text-sm text-shield-muted">
            Select a hotspot or region on the map to inspect local threat patterns, risk indicators, and AI-generated recommendations.
          </p>
        </div>
      </div>
    )
  }

  const isCritical = selectedHotspot.riskLevel === "Critical"
  const isHigh = selectedHotspot.riskLevel === "High"
  const isMedium = selectedHotspot.riskLevel === "Medium"
  
  const themeColor = isCritical || isHigh ? "text-red-400" : isMedium ? "text-amber-400" : "text-green-400"
  const themeBg = isCritical || isHigh ? "bg-red-500/10 border-red-500/20" : isMedium ? "bg-amber-500/10 border-amber-500/20" : "bg-green-500/10 border-green-500/20"
  
  const trendIcon = 
    selectedHotspot.trend === "Increasing" ? <TrendingUp className="h-4 w-4 text-red-400" /> :
    selectedHotspot.trend === "Decreasing" ? <TrendingDown className="h-4 w-4 text-green-400" /> :
    <Minus className="h-4 w-4 text-amber-400" />

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 overflow-y-auto custom-scrollbar sm:p-6">
      
      {/* Region Summary */}
      <div className="mb-6 border-b border-shield-cyan/10 pb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-shield-muted mb-1">
          {selectedHotspot.stateName}
        </h3>
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">{selectedHotspot.regionName}</h2>
          <div className={`flex flex-col items-end rounded p-2 border ${themeBg}`}>
            <span className={`text-2xl font-bold leading-none ${themeColor}`}>{selectedHotspot.riskScore}</span>
            <span className={`text-[10px] uppercase font-bold mt-1 ${themeColor}`}>{selectedHotspot.riskLevel}</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded border border-shield-cyan/10 bg-shield-navy/40 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-shield-muted">Reported Incidents</p>
            <p className="mt-1 text-lg font-bold text-white">{selectedHotspot.reportedIncidents}</p>
          </div>
          <div className="rounded border border-shield-cyan/10 bg-shield-navy/40 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-shield-muted">Threat Trend</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
              {trendIcon} {selectedHotspot.trend}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        
        {/* Threat Distribution Chart (Custom CSS Bars) */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> Threat Distribution
          </h3>
          <div className="space-y-3">
            {selectedHotspot.threatDistribution.map((threat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">{threat.category}</span>
                  <span className="text-shield-muted">{threat.percentage}% ({threat.count})</span>
                </div>
                <div className="h-2 w-full bg-shield-navy rounded-full overflow-hidden border border-shield-cyan/5">
                  <div 
                    className="h-full bg-shield-cyan" 
                    style={{ width: `${threat.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Deployment Recommendation */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" /> AI Deployment Recommendation
          </h3>
          
          <div className="rounded-lg border border-shield-cyan/20 bg-shield-navy/40 p-4 relative overflow-hidden">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${selectedHotspot.recommendation.priority === "High" ? "bg-red-500" : "bg-amber-500"}`} />
            
            <div className="flex items-center gap-2 mb-2 pt-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                selectedHotspot.recommendation.priority === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {selectedHotspot.recommendation.priority} Priority
              </span>
            </div>
            
            <p className="text-xs text-white/90 leading-relaxed mb-4">
              {selectedHotspot.recommendation.summary}
            </p>
            
            <div className="bg-shield-navy-light/50 p-3 rounded border border-shield-cyan/10">
              <p className="text-[10px] uppercase font-semibold text-shield-cyan mb-2">Recommended Actions:</p>
              <ul className="space-y-1.5">
                {selectedHotspot.recommendation.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] text-shield-muted">
                    <Target className="h-3.5 w-3.5 mt-0.5 shrink-0 text-shield-cyan/50" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Action */}
      <div className="mt-6 pt-4 border-t border-shield-cyan/10">
        <Button 
          onClick={onOpenReport}
          className="w-full bg-shield-cyan/10 text-shield-cyan hover:bg-shield-cyan/20 border border-shield-cyan/20"
        >
          <FileText className="mr-2 h-4 w-4" /> Generate Regional Intelligence Brief
        </Button>
      </div>

    </div>
  )
}
