"use client"

import { CommandCase } from "@/lib/types/command-center"
import { X, Briefcase, MapPin, Calendar, Crosshair, AlertCircle, Map, Target, UserCheck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  caseDetail: CommandCase | null
  onClose: () => void
}

export function CaseDetailDrawer({ caseDetail, onClose }: Props) {
  if (!caseDetail) return null

  const isCritical = caseDetail.riskLevel === "Critical"
  const themeColor = isCritical ? "text-red-400" : caseDetail.riskLevel === "High" ? "text-amber-400" : "text-yellow-400"
  const themeBg = isCritical ? "bg-red-500/10 border-red-500/20" : caseDetail.riskLevel === "High" ? "bg-amber-500/10 border-amber-500/20" : "bg-yellow-500/10 border-yellow-500/20"

  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[5000] bg-shield-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[5001] w-full max-w-md bg-shield-navy-light/95 border-l border-shield-cyan/20 shadow-2xl flex flex-col transform transition-transform overflow-hidden sm:max-w-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-shield-cyan/20 bg-shield-navy/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-shield-cyan" />
            <h2 className="text-lg font-bold text-white">Investigation Context</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded p-1 text-shield-muted transition-colors hover:bg-shield-cyan/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Top Profile */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono text-shield-cyan/70 mb-1">Case {caseDetail.id}</div>
              <h1 className="text-2xl font-bold text-white leading-tight mb-2">{caseDetail.threatCategory}</h1>
              <div className="flex flex-col gap-1 text-xs text-shield-muted">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {caseDetail.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(caseDetail.reportedAt)}</span>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-center rounded px-3 py-2 border shrink-0 ${themeBg}`}>
              <span className={`text-3xl font-bold leading-none ${themeColor}`}>{caseDetail.riskScore}</span>
              <span className={`text-[10px] uppercase font-bold mt-1 ${themeColor}`}>{caseDetail.riskLevel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-shield-muted">Status:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              caseDetail.status === "Immediate Review" ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-shield-cyan/10 text-shield-cyan border border-shield-cyan/20"
            }`}>
              {caseDetail.status}
            </span>
          </div>

          <div className="border-t border-shield-cyan/10 pt-6">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-shield-muted mb-3 flex items-center gap-2">
              <Crosshair className="h-3.5 w-3.5 text-shield-cyan" /> Detected Risk Indicators
            </h3>
            <ul className="space-y-2">
              {caseDetail.indicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/90 bg-shield-navy/40 p-2.5 rounded border border-shield-cyan/5">
                  <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${themeColor}`} />
                  {ind}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-shield-cyan/10 pt-6">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-shield-muted mb-3 flex items-center gap-2">
              <Map className="h-3.5 w-3.5 text-shield-cyan" /> Regional Context
            </h3>
            <div className="bg-shield-navy/40 rounded p-4 border border-shield-cyan/10 flex justify-between items-center">
              <div>
                <p className="text-xs text-shield-muted mb-1">Local Threat Profile</p>
                <p className="text-sm font-semibold text-white">{caseDetail.threatCategory} Concentration</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{caseDetail.reportedCases}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${caseDetail.trend === "Increasing" ? "text-red-400" : "text-shield-cyan"}`}>
                  {caseDetail.trend} trend
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-shield-cyan/10 pt-6">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-shield-muted mb-3 flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-shield-cyan" /> Recommended Analyst Actions
            </h3>
            <ul className="space-y-2 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-shield-cyan/20">
              {caseDetail.recommendedActions.map((action, i) => (
                <li key={i} className="flex items-center gap-3 relative">
                  <div className="h-[24px] w-[24px] rounded-full bg-shield-navy border-2 border-shield-cyan/50 flex items-center justify-center text-[10px] font-bold text-shield-cyan shrink-0 z-10">
                    {i + 1}
                  </div>
                  <span className="text-xs text-shield-muted">{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-shield-cyan/20 bg-shield-navy/90 p-4 space-y-3">
          
          <div className="rounded bg-shield-cyan/5 border border-shield-cyan/10 p-2.5 flex items-center gap-2 text-[10px] text-shield-cyan">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <p className="leading-snug font-medium">Human-in-the-loop review required. Preliminary AI assessments are for investigation support only.</p>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90" onClick={() => alert("Assigned to analyst review queue.")}>
              <UserCheck className="mr-2 h-4 w-4" /> Assign for Review
            </Button>
            <Button variant="outline" className="flex-1 border-shield-cyan/20 text-shield-cyan hover:bg-shield-cyan/10" onClick={() => alert("Opening full evidence dashboard...")}>
              Open Full Intelligence
            </Button>
          </div>
        </div>

      </div>
    </>
  )
}
