"use client"

import { DashboardMetrics } from "@/lib/types/command-center"
import { Briefcase, TriangleAlert, Users, MapPin, Clock } from "lucide-react"

interface Props {
  metrics: DashboardMetrics
}

export function CommandMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
      
      {/* 1. Active Cases */}
      <div className="rounded-lg border border-shield-cyan/20 bg-shield-navy-light/50 p-4 shadow-xl shadow-shield-cyan/5">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-4 w-4 text-shield-cyan" />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-shield-muted">Active Cases</h3>
        </div>
        <div className="mt-1">
          <p className="text-2xl font-bold text-white">{metrics.activeCases.value}</p>
          <p className="text-xs text-shield-muted mt-1">{metrics.activeCases.addedToday} added today</p>
        </div>
      </div>

      {/* 2. Critical Alerts */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <TriangleAlert className="h-4 w-4 text-red-500" />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-red-500/80">Critical Alerts</h3>
        </div>
        <div className="mt-1">
          <p className="text-2xl font-bold text-red-500">{metrics.criticalAlerts.value}</p>
          <p className="text-xs text-red-500/60 mt-1">Requires immediate review</p>
        </div>
      </div>

      {/* 3. High-Risk Entities */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-amber-500" />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">High-Risk Entities</h3>
        </div>
        <div className="mt-1">
          <p className="text-2xl font-bold text-amber-500">{metrics.highRiskEntities.value}</p>
          <p className="text-xs text-amber-500/60 mt-1">Across connected investigations</p>
        </div>
      </div>

      {/* 4. Emerging Hotspots */}
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-orange-500/80">Emerging Hotspots</h3>
        </div>
        <div className="mt-1">
          <p className="text-2xl font-bold text-orange-500">{metrics.emergingHotspots.value}</p>
          <p className="text-xs text-orange-500/60 mt-1">{metrics.emergingHotspots.increasingRapidly} increasing rapidly</p>
        </div>
      </div>

      {/* 5. Preliminary Response Time */}
      <div className="rounded-lg border border-shield-cyan/20 bg-shield-navy-light/50 p-4 shadow-xl shadow-shield-cyan/5">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-shield-cyan" />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-shield-muted">Avg Response</h3>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <p className="text-2xl font-bold text-white">{metrics.avgResponseTimeMin}</p>
          <span className="text-xs text-shield-muted">min</span>
        </div>
        <p className="text-[10px] text-shield-muted mt-1 leading-snug">Average analyst response</p>
      </div>

    </div>
  )
}
