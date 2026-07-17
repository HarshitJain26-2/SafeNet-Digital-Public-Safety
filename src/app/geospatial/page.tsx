"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GeospatialFilterPanel } from "@/components/geospatial/geospatial-filter-panel"
import { RegionalIntelligencePanel } from "@/components/geospatial/regional-intelligence-panel"
import { GeospatialAnalytics } from "@/components/geospatial/geospatial-analytics"
import { RegionalBriefDialog } from "@/components/geospatial/regional-brief-dialog"
import { 
  GeospatialFilterState, 
  CrimeHotspot, 
  GeospatialAnalyticsSummary,
  RegionalIntelligenceBrief
} from "@/lib/types/geospatial"
import { filterGeospatialData, MOCK_TREND_DATA } from "@/lib/services/geospatial"
import { Map, ShieldCheck, Lock } from "lucide-react"

// Dynamically import the map component with SSR disabled
const CybercrimeThreatMap = dynamic(
  () => import("@/components/geospatial/cybercrime-threat-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-full min-h-[400px] lg:min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-shield-cyan/20 border-t-shield-cyan" />
        <p className="mt-4 text-sm font-medium text-shield-muted">Initializing Geospatial Engine...</p>
      </div>
    )
  }
)

const DEFAULT_FILTERS: GeospatialFilterState = {
  state: "All States",
  district: "All Districts",
  threatCategory: "All Threat Categories",
  riskLevel: "All Risk Levels",
  timeRange: "Last 30 Days"
}

export default function GeospatialPage() {
  const [filters, setFilters] = useState<GeospatialFilterState>(DEFAULT_FILTERS)
  const [isApplying, setIsApplying] = useState(true)
  const [hotspots, setHotspots] = useState<CrimeHotspot[]>([])
  const [summary, setSummary] = useState<GeospatialAnalyticsSummary | null>(null)
  const [trendData, setTrendData] = useState<ThreatTrendDataPoint[]>([])
  
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null)
  const [showBrief, setShowBrief] = useState(false)

  useEffect(() => {
    let isMounted = true
    
    filterGeospatialData(filters).then(res => {
      if (isMounted) {
        setHotspots(res.hotspots)
        setSummary(res.summary)
        setTrendData(res.trends || [])
        setSelectedHotspotId(prev => {
          if (!prev && res.hotspots.length > 0) {
            const highRisk = res.hotspots.find(h => h.riskLevel === "Critical" || h.riskLevel === "High")
            return highRisk ? highRisk.id : prev
          }
          return prev
        })
        setIsApplying(false)
      }
    })

    return () => { isMounted = false }
  }, [filters])

  const handleApplyFilters = (newFilters: GeospatialFilterState) => {
    setIsApplying(true)
    setFilters(newFilters)
    setSelectedHotspotId(null) // Reset selection when filters change
  }

  const handleSelectHotspot = (id: string | null) => {
    setSelectedHotspotId(id)
  }

  const selectedHotspot = useMemo(() => {
    return hotspots.find(h => h.id === selectedHotspotId) || null
  }, [hotspots, selectedHotspotId])

  const currentBrief: RegionalIntelligenceBrief | null = selectedHotspot ? {
    hotspot: selectedHotspot,
    generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
  } : null

  return (
    <div className="flex min-h-screen flex-col bg-shield-navy selection:bg-shield-cyan/30">
      
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 flex justify-center bg-shield-navy">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <Navigation />

      <main className="relative flex-1 pt-24 pb-12 lg:pt-24">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header & Badges */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-shield-cyan/10 pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Geospatial Crime Intelligence</h1>
              <p className="mt-1 max-w-3xl text-sm text-shield-muted">
                Visualize cybercrime concentration, identify emerging threat zones, and generate explainable deployment intelligence across regions.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Map className="h-3 w-3" /> Geospatial Engine Ready
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <ShieldCheck className="h-3 w-3" /> Regional Intelligence
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Lock className="h-3 w-3" /> Secure Crime Analytics
              </div>
            </div>
          </div>

          {/* Main 3-Column Workspace Grid */}
          <div className="grid gap-5 lg:grid-cols-[300px_1fr_320px] xl:grid-cols-[340px_1.5fr_380px] lg:gap-6 lg:items-start">
            
            {/* Left Zone: Filters (Approx 24%) */}
            <div className="order-2 lg:order-1">
              <GeospatialFilterPanel 
                initialState={filters}
                onApplyFilters={handleApplyFilters}
                isApplying={isApplying}
              />
            </div>

            {/* Center Zone: Threat Map (Approx 50%) */}
            <div className="order-1 lg:order-2 min-h-[500px] lg:h-full">
              <CybercrimeThreatMap 
                hotspots={hotspots}
                selectedHotspotId={selectedHotspotId}
                onSelectHotspot={handleSelectHotspot}
                isApplying={isApplying}
              />
            </div>

            {/* Right Zone: Regional Intelligence (Approx 26%) */}
            <div className="order-3 lg:order-3">
              <RegionalIntelligencePanel 
                selectedHotspot={selectedHotspot}
                onOpenReport={() => setShowBrief(true)}
              />
            </div>
          </div>

          {/* Bottom Analytics Section */}
          {summary && (
            <GeospatialAnalytics 
              summary={summary}
              hotspots={hotspots}
              trendData={trendData}
              onSelectHotspot={handleSelectHotspot}
            />
          )}

        </div>
      </main>

      {/* Brief Modal */}
      {showBrief && currentBrief && (
        <RegionalBriefDialog 
          brief={currentBrief} 
          onClose={() => setShowBrief(false)} 
        />
      )}

      <Footer />
    </div>
  )
}
