"use client"

import { useState } from "react"
import { CommandCase } from "@/lib/types/command-center"
import { AlertCircle, Clock, MapPin } from "lucide-react"

interface Props {
  cases: CommandCase[]
  selectedCaseId: string | null
  onSelectCase: (id: string) => void
}

export function PriorityQueue({ cases, selectedCaseId, onSelectCase }: Props) {
  const [activeTab, setActiveTab] = useState<"Critical" | "High Risk" | "New">("Critical")

  const filteredCases = cases.filter(c => {
    if (activeTab === "Critical") return c.riskLevel === "Critical"
    if (activeTab === "High Risk") return c.riskLevel === "High"
    // For prototype, let's assume "New" means anything reported very recently (in mock data, everything is recent)
    // We'll just show all cases sorted by timestamp for "New"
    return true
  }).sort((a, b) => {
    if (activeTab === "New") return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    return b.riskScore - a.riskScore
  })

  return (
    <div className="flex flex-col h-full rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 shadow-xl shadow-shield-cyan/5 overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="border-b border-shield-cyan/10 bg-shield-navy/40">
        <div className="p-4 pb-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-shield-cyan" /> Priority Queue
          </h2>
          <div className="flex gap-4">
            {["Critical", "High Risk", "New"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "Critical" | "High Risk" | "New")}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === tab 
                    ? "border-shield-cyan text-white" 
                    : "border-transparent text-shield-muted hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {filteredCases.map(c => {
          const isCritical = c.riskLevel === "Critical"
          const isSelected = selectedCaseId === c.id
          
          return (
            <div 
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                isSelected 
                  ? "border-shield-cyan bg-shield-cyan/10 ring-1 ring-shield-cyan/50" 
                  : "border-shield-cyan/10 bg-shield-navy/30 hover:border-shield-cyan/30 hover:bg-shield-navy/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] font-mono text-shield-muted">{c.id}</div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  isCritical ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                }`}>
                  {c.riskLevel} • {c.riskScore}
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-white mb-2">{c.threatCategory}</h3>
              
              <div className="flex items-center gap-1.5 text-[11px] text-shield-muted mb-3">
                <MapPin className="h-3 w-3" /> {c.location}
              </div>

              {/* Status & Action */}
              <div className="flex items-center justify-between border-t border-shield-cyan/10 pt-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  c.status === "Immediate Review" ? "text-red-400" : "text-shield-cyan"
                }`}>
                  {c.status}
                </span>
                <span className="text-[10px] font-semibold text-shield-cyan/80 group-hover:text-shield-cyan flex items-center gap-1">
                  Open Case <span className="text-shield-cyan opacity-50">&rarr;</span>
                </span>
              </div>
            </div>
          )
        })}

        {filteredCases.length === 0 && (
          <div className="py-12 text-center text-sm text-shield-muted">
            No active cases match this filter.
          </div>
        )}
      </div>
      
    </div>
  )
}
