"use client"

import { CrimeHotspot, GeospatialAnalyticsSummary, ThreatTrendDataPoint } from "@/lib/types/geospatial"
import { 
  AlertCircle, 
  MapPin, 
  Activity, 
  Clock, 
  ShieldAlert, 
  BarChart, 
  TrendingUp, 
  List,
  Eye
} from "lucide-react"

interface Props {
  summary: GeospatialAnalyticsSummary
  hotspots: CrimeHotspot[]
  trendData: ThreatTrendDataPoint[]
  onSelectHotspot: (id: string) => void
}

export function GeospatialAnalytics({ summary, hotspots, trendData, onSelectHotspot }: Props) {
  
  // Custom SVG Line Chart for the Trend Data to avoid Recharts dependency
  const maxValue = Math.max(...trendData.flatMap(d => [
    d["Digital Arrest Scam"] as number, 
    d["Phishing"] as number, 
    d["Fake UPI Request"] as number
  ])) * 1.2 // Add 20% headroom

  const chartHeight = 180
  const chartWidth = 600 // SVG viewBox width, scales responsively via CSS
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const getPoint = (val: number, index: number, total: number) => {
    const x = padding.left + (index / (total - 1)) * innerWidth
    const y = padding.top + innerHeight - (val / maxValue) * innerHeight
    return `${x},${y}`
  }

  const generatePath = (key: string) => {
    return trendData.map((d, i) => getPoint(d[key] as number, i, trendData.length)).join(" L ")
  }

  return (
    <div className="space-y-6 mt-6">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5">
          <div className="flex items-center gap-2 mb-2 text-shield-muted">
            <Activity className="h-4 w-4" />
            <h3 className="text-xs uppercase tracking-wider font-semibold">Reported Incidents</h3>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-white">{summary.totalIncidents.toLocaleString()}</p>
            <p className={`text-xs font-semibold mb-1 ${summary.incidentTrendPercent > 0 ? "text-red-400" : summary.incidentTrendPercent < 0 ? "text-green-400" : "text-shield-muted"}`}>
              {summary.incidentTrendPercent > 0 ? "+" : ""}{summary.incidentTrendPercent}%
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-red-400/80">
            <ShieldAlert className="h-4 w-4" />
            <h3 className="text-xs uppercase tracking-wider font-semibold">High-Risk Zones</h3>
          </div>
          <p className="text-2xl font-bold text-red-400">{summary.highRiskZones}</p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-amber-400/80">
            <TrendingUp className="h-4 w-4" />
            <h3 className="text-xs uppercase tracking-wider font-semibold">Emerging Hotspots</h3>
          </div>
          <p className="text-2xl font-bold text-amber-400">{summary.emergingHotspots}</p>
        </div>

        <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5">
          <div className="flex items-center gap-2 mb-2 text-shield-muted">
            <Clock className="h-4 w-4" />
            <h3 className="text-xs uppercase tracking-wider font-semibold">Avg Prelim Response</h3>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold text-white">{summary.avgResponseTimeMin}</p>
            <p className="text-sm text-shield-muted mb-0.5">min</p>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Threat Trend Chart */}
        <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Regional Threat Trend
          </h3>
          
          <div className="w-full relative h-[180px] mb-4 overflow-hidden border-b border-l border-shield-cyan/20">
            {/* Y-Axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] text-shield-muted pb-6">
              <span>{Math.round(maxValue)}</span>
              <span>{Math.round(maxValue / 2)}</span>
              <span>0</span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full preserve-3d absolute top-0 left-0" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1={padding.left} y1={padding.top} x2={chartWidth - padding.right} y2={padding.top} stroke="#00d4ff" strokeOpacity="0.1" strokeDasharray="4 4" />
              <line x1={padding.left} y1={padding.top + innerHeight / 2} x2={chartWidth - padding.right} y2={padding.top + innerHeight / 2} stroke="#00d4ff" strokeOpacity="0.1" strokeDasharray="4 4" />
              
              {/* Lines */}
              <path d={`M ${generatePath("Digital Arrest Scam")}`} fill="none" stroke="#f87171" strokeWidth="2" strokeLinejoin="round" />
              <path d={`M ${generatePath("Phishing")}`} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
              <path d={`M ${generatePath("Fake UPI Request")}`} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round" />
              
              {/* Data points */}
              {trendData.map((d, i) => {
                const parts = getPoint(d["Digital Arrest Scam"] as number, i, trendData.length).split(",")
                return <circle key={`p1-${i}`} cx={parts[0]} cy={parts[1]} r="3" fill="#0f172a" stroke="#f87171" strokeWidth="2" />
              })}
              {trendData.map((d, i) => {
                const parts = getPoint(d["Phishing"] as number, i, trendData.length).split(",")
                return <circle key={`p2-${i}`} cx={parts[0]} cy={parts[1]} r="3" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
              })}
              {trendData.map((d, i) => {
                const parts = getPoint(d["Fake UPI Request"] as number, i, trendData.length).split(",")
                return <circle key={`p3-${i}`} cx={parts[0]} cy={parts[1]} r="3" fill="#0f172a" stroke="#4ade80" strokeWidth="2" />
              })}
            </svg>

            {/* X-Axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-shield-muted pl-10 pr-5">
              {trendData.map(d => <span key={d.date}>{d.date}</span>)}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap gap-4 text-[10px] font-semibold uppercase text-shield-muted">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Digital Arrest Scam</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Phishing</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400" /> Fake UPI Request</div>
          </div>
        </div>

        {/* High-Risk Regions Table */}
        <div className="rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 flex flex-col h-full">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
            <List className="h-4 w-4" /> High-Risk Regions
          </h3>
          
          <div className="flex-1 overflow-auto custom-scrollbar border border-shield-cyan/10 rounded-lg bg-shield-navy/30">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="sticky top-0 bg-shield-navy border-b border-shield-cyan/20 text-shield-muted z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold">Region</th>
                  <th className="px-3 py-2 font-semibold">Primary Threat</th>
                  <th className="px-3 py-2 font-semibold text-right">Score</th>
                  <th className="px-3 py-2 font-semibold text-center">Trend</th>
                  <th className="px-3 py-2 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shield-cyan/10">
                {hotspots.sort((a,b) => b.riskScore - a.riskScore).map(hotspot => (
                  <tr key={hotspot.id} className="hover:bg-shield-cyan/5 transition-colors">
                    <td className="px-3 py-2">
                      <div className="font-semibold text-white">{hotspot.regionName}</div>
                      <div className="text-[10px] text-shield-muted">{hotspot.stateName}</div>
                    </td>
                    <td className="px-3 py-2 text-shield-muted">{hotspot.primaryThreat}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-bold ${hotspot.riskScore >= 80 ? "text-red-400" : hotspot.riskScore >= 60 ? "text-amber-400" : "text-green-400"}`}>
                        {hotspot.riskScore}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        hotspot.trend === "Increasing" ? "bg-red-500/20 text-red-400" :
                        hotspot.trend === "Decreasing" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {hotspot.trend}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button 
                        onClick={() => onSelectHotspot(hotspot.id)}
                        className="inline-flex items-center justify-center rounded border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-[10px] font-semibold text-shield-cyan transition-colors hover:bg-shield-cyan/20"
                      >
                        <Eye className="h-3 w-3 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {hotspots.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-shield-muted">
                      No regions match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Prototype Notice */}
      <div className="rounded bg-shield-navy/60 p-4 text-xs text-shield-muted/60 text-center flex items-center justify-center gap-2 border border-shield-cyan/5">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <p className="max-w-4xl leading-relaxed">
          Geospatial insights shown in this prototype use demonstration data and are intended for preliminary decision support. Operational decisions require verification through authorized sources.
        </p>
      </div>

    </div>
  )
}
