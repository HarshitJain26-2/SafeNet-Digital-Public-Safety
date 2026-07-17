"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CommandMetrics } from "@/components/command-center/command-metrics"
import { PriorityQueue } from "@/components/command-center/priority-queue"
import { LiveIntelligenceBrief } from "@/components/command-center/live-intelligence-brief"
import { CommandAnalytics } from "@/components/command-center/command-analytics"
import { CrossModuleActivityFeed } from "@/components/command-center/cross-module-activity"
import { QuickAccessLinks } from "@/components/command-center/quick-access-links"
import { CaseDetailDrawer } from "@/components/command-center/case-detail-drawer"
import { fetchCommandData } from "@/lib/services/command-center"
import { 
  CommandCase, 
  DashboardMetrics, 
  CrossModuleActivity, 
  AnalyticsTrendPoint, 
  AnalyticsDistribution, 
  InvestigationStatusCounts 
} from "@/lib/types/command-center"
import { Activity, ShieldCheck, Lock } from "lucide-react"

// Dynamically import the map component with SSR disabled
const UnifiedThreatMap = dynamic(
  () => import("@/components/command-center/unified-threat-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[500px] lg:h-full min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-shield-cyan/20 border-t-shield-cyan" />
        <p className="mt-4 text-sm font-medium text-shield-muted">Initializing Map Engine...</p>
      </div>
    )
  }
)

export default function CommandCenterPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [cases, setCases] = useState<CommandCase[]>([])
  const [activity, setActivity] = useState<CrossModuleActivity[]>([])
  const [trends, setTrends] = useState<AnalyticsTrendPoint[]>([])
  const [distribution, setDistribution] = useState<AnalyticsDistribution[]>([])
  const [statusCounts, setStatusCounts] = useState<InvestigationStatusCounts | null>(null)

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [drawerCaseId, setDrawerCaseId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    fetchCommandData().then(data => {
      if (isMounted) {
        setMetrics(data.metrics)
        setCases(data.cases)
        setActivity(data.activity)
        setTrends(data.trends)
        setDistribution(data.distribution)
        setStatusCounts(data.statusCounts)
        
        // Auto-select first critical case
        if (data.cases.length > 0) {
          const critical = data.cases.find(c => c.riskLevel === "Critical")
          setSelectedCaseId(critical ? critical.id : data.cases[0].id)
        }
      }
    })
    return () => { isMounted = false }
  }, [])

  const selectedCase = cases.find(c => c.id === selectedCaseId) || null
  const drawerCase = cases.find(c => c.id === drawerCaseId) || null

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
              <div className="text-[10px] uppercase font-bold tracking-wider text-shield-cyan mb-2">Authorized Investigation Workspace</div>
              <h1 className="text-2xl font-bold text-white tracking-tight">ShieldAI Investigation Command Center</h1>
              <p className="mt-1 max-w-3xl text-sm text-shield-muted">
                Unified AI-assisted intelligence for case prioritization, threat monitoring, and coordinated human investigation.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Activity className="h-3 w-3" /> Intelligence Systems Active
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Lock className="h-3 w-3" /> Secure Analyst Workspace
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <ShieldCheck className="h-3 w-3" /> Live Prototype Intelligence
              </div>
            </div>
          </div>

          {metrics && <CommandMetrics metrics={metrics} />}

          {/* Main 3-Column Command Grid */}
          <div className="grid gap-5 lg:grid-cols-[300px_1fr_320px] xl:grid-cols-[360px_1.5fr_380px] lg:gap-6 lg:items-start h-auto lg:h-[700px] mb-6">
            
            {/* Left Panel: Priority Queue (~25%) */}
            <div className="h-[500px] lg:h-full order-2 lg:order-1">
              <PriorityQueue 
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={setSelectedCaseId}
              />
            </div>

            {/* Center Panel: Map (~50%) */}
            <div className="order-1 lg:order-2 h-full">
              <UnifiedThreatMap 
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={setSelectedCaseId}
              />
            </div>

            {/* Right Panel: Intelligence Brief (~25%) */}
            <div className="h-auto lg:h-full order-3 lg:order-3">
              <LiveIntelligenceBrief 
                selectedCase={selectedCase}
                onOpenInvestigation={setDrawerCaseId}
              />
            </div>

          </div>

          {/* Secondary Analytics */}
          {trends.length > 0 && distribution.length > 0 && statusCounts && (
            <CommandAnalytics 
              trends={trends}
              distribution={distribution}
              statusCounts={statusCounts}
            />
          )}

          {/* Connected Intelligence */}
          {activity.length > 0 && (
            <CrossModuleActivityFeed activities={activity} />
          )}

          {/* Quick Access */}
          <QuickAccessLinks />

        </div>
      </main>

      {/* Case Detail Drawer */}
      <CaseDetailDrawer 
        caseDetail={drawerCase}
        onClose={() => setDrawerCaseId(null)}
      />

      <Footer />
    </div>
  )
}
