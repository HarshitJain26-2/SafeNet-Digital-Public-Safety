"use client"

import { AnalyticsTrendPoint, AnalyticsDistribution, InvestigationStatusCounts } from "@/lib/types/command-center"
import { BarChart, PieChart, CheckSquare, Activity } from "lucide-react"

interface Props {
  trends: AnalyticsTrendPoint[]
  distribution: AnalyticsDistribution[]
  statusCounts: InvestigationStatusCounts
}

export function CommandAnalytics({ trends, distribution, statusCounts }: Props) {
  
  // Threat Activity Trend (Line Chart via SVG)
  const maxValue = Math.max(...trends.flatMap(d => [
    d["Digital Arrest Scam"] as number, 
    d["Investment Fraud"] as number, 
    d["Fake UPI Request"] as number,
    d["Phishing"] as number
  ])) * 1.1

  const chartHeight = 160
  const chartWidth = 500
  const padding = { top: 20, right: 10, bottom: 25, left: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const getPoint = (val: number, index: number) => {
    const x = padding.left + (index / (trends.length - 1)) * innerWidth
    const y = padding.top + innerHeight - (val / maxValue) * innerHeight
    return `${x},${y}`
  }

  const generatePath = (key: string) => trends.map((d, i) => getPoint(d[key] as number, i)).join(" L ")

  // Distribution Colors
  const distColors = ["#00d4ff", "#fbbf24", "#4ade80", "#f87171", "#a78bfa"]

  // Status Progress total
  const totalStatus = statusCounts.underReview + statusCounts.analystAssigned + statusCounts.evidenceReview + statusCounts.escalated + statusCounts.resolved

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Threat Activity Trend */}
      <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-shield-cyan" /> Threat Activity Trend
        </h3>
        <div className="relative h-[160px] w-full border-b border-l border-shield-cyan/20">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] text-shield-muted pb-6">
            <span>{Math.round(maxValue)}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full absolute top-0 left-0" preserveAspectRatio="none">
            {/* Grid */}
            <line x1={padding.left} y1={padding.top} x2={chartWidth - padding.right} y2={padding.top} stroke="#00d4ff" strokeOpacity="0.1" strokeDasharray="4 4" />
            <line x1={padding.left} y1={padding.top + innerHeight / 2} x2={chartWidth - padding.right} y2={padding.top + innerHeight / 2} stroke="#00d4ff" strokeOpacity="0.1" strokeDasharray="4 4" />
            {/* Lines */}
            <path d={`M ${generatePath("Digital Arrest Scam")}`} fill="none" stroke="#f87171" strokeWidth="2" />
            <path d={`M ${generatePath("Investment Fraud")}`} fill="none" stroke="#fbbf24" strokeWidth="2" />
            <path d={`M ${generatePath("Fake UPI Request")}`} fill="none" stroke="#4ade80" strokeWidth="2" />
            <path d={`M ${generatePath("Phishing")}`} fill="none" stroke="#a78bfa" strokeWidth="2" />
          </svg>
          <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-shield-muted pl-8 pr-2">
            {trends.map(d => <span key={d.date}>{d.date}</span>)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-semibold text-shield-muted">
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Digital Arrest Scam</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Investment Fraud</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400" /> Fake UPI Request</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-400" /> Phishing</div>
        </div>
      </div>

      {/* 2. Threat Distribution */}
      <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
          <PieChart className="h-4 w-4 text-shield-cyan" /> Threat Distribution
        </h3>
        <div className="space-y-3 mt-4">
          {distribution.map((d, i) => (
            <div key={d.category}>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-white">{d.category}</span>
                <span className="text-shield-cyan">{d.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-shield-navy rounded-full overflow-hidden border border-shield-cyan/10">
                <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, backgroundColor: distColors[i % distColors.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Investigation Status */}
      <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-shield-cyan" /> Investigation Status
        </h3>
        
        {/* Progress Bar Stack */}
        <div className="h-6 w-full rounded-full bg-shield-navy overflow-hidden flex border border-shield-cyan/20 mt-6 mb-6">
          <div className="h-full bg-shield-cyan/80" style={{ width: `${(statusCounts.resolved/totalStatus)*100}%` }} title="Resolved" />
          <div className="h-full bg-amber-500/80" style={{ width: `${(statusCounts.analystAssigned/totalStatus)*100}%` }} title="Assigned" />
          <div className="h-full bg-orange-500/80" style={{ width: `${(statusCounts.underReview/totalStatus)*100}%` }} title="Under Review" />
          <div className="h-full bg-purple-500/80" style={{ width: `${(statusCounts.evidenceReview/totalStatus)*100}%` }} title="Evidence Review" />
          <div className="h-full bg-red-500/80" style={{ width: `${(statusCounts.escalated/totalStatus)*100}%` }} title="Escalated" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between border-b border-shield-cyan/10 pb-1">
            <span className="text-shield-muted">Resolved</span>
            <span className="text-white font-bold">{statusCounts.resolved}</span>
          </div>
          <div className="flex justify-between border-b border-shield-cyan/10 pb-1">
            <span className="text-shield-muted">Assigned</span>
            <span className="text-white font-bold">{statusCounts.analystAssigned}</span>
          </div>
          <div className="flex justify-between border-b border-shield-cyan/10 pb-1">
            <span className="text-shield-muted">Under Review</span>
            <span className="text-white font-bold">{statusCounts.underReview}</span>
          </div>
          <div className="flex justify-between border-b border-shield-cyan/10 pb-1">
            <span className="text-shield-muted">Evidence</span>
            <span className="text-white font-bold">{statusCounts.evidenceReview}</span>
          </div>
          <div className="flex justify-between border-b border-shield-cyan/10 pb-1">
            <span className="text-shield-muted">Escalated</span>
            <span className="text-red-400 font-bold">{statusCounts.escalated}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
