"use client"

import { CrossModuleActivity } from "@/lib/types/command-center"
import { Activity, ShieldCheck, ScanLine, Network, MapIcon, ArrowRight } from "lucide-react"

interface Props {
  activities: CrossModuleActivity[]
}

const moduleIcons: Record<string, React.ElementType> = {
  "Citizen Fraud Shield": ShieldCheck,
  "Currency Verification": ScanLine,
  "Fraud Network Analysis": Network,
  "Geospatial Crime Intelligence": MapIcon
}

export function CrossModuleActivityFeed({ activities }: Props) {
  return (
    <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 w-full mt-6 overflow-hidden">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2 border-b border-shield-cyan/10 pb-3">
        <Activity className="h-4 w-4 text-shield-cyan" /> Cross-Module Intelligence Activity
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map(act => {
          const Icon = moduleIcons[act.moduleName] || Activity
          const isCritical = act.severity === "Critical"
          const isHigh = act.severity === "High"

          return (
            <div key={act.id} className="rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-4 flex flex-col justify-between hover:bg-shield-navy/60 transition-colors group">
              <div>
                <div className="flex items-center gap-2 mb-2 text-shield-muted">
                  <div className="p-1 rounded bg-shield-cyan/10 text-shield-cyan">
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider truncate">{act.moduleName}</span>
                </div>
                
                <p className="text-xs text-white/90 leading-relaxed font-medium mb-3">
                  {act.summary}
                </p>
              </div>

              <div>
                {act.caseId && (
                  <div className="text-[10px] font-mono text-shield-cyan/70 mb-1">
                    Case: {act.caseId}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-shield-cyan/5">
                  <span className="text-[9px] text-shield-muted/60">{act.timeAgo}</span>
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isCritical ? "bg-red-500" : isHigh ? "bg-amber-500" : "bg-shield-cyan"
                    }`} />
                    <button className="text-[10px] font-bold uppercase text-shield-cyan group-hover:text-white flex items-center transition-colors">
                      Review <ArrowRight className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
