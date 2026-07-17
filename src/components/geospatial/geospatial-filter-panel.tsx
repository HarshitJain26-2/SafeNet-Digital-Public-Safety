"use client"

import { useState } from "react"
import { GeospatialFilterState, ThreatCategory, RiskLevel, TimeRange } from "@/lib/types/geospatial"
import { INDIAN_STATES } from "@/lib/services/geospatial"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, MapPin, AlertTriangle, Clock, Target, RotateCcw, X } from "lucide-react"

interface Props {
  initialState: GeospatialFilterState
  onApplyFilters: (filters: GeospatialFilterState) => void
  isApplying: boolean
}

export function GeospatialFilterPanel({ initialState, onApplyFilters, isApplying }: Props) {
  const [filters, setFilters] = useState<GeospatialFilterState>(initialState)

  const states = Object.keys(INDIAN_STATES)
  const districts = INDIAN_STATES[filters.state] || ["All Districts"]

  const handleStateChange = (state: string) => {
    setFilters(prev => ({
      ...prev,
      state,
      district: "All Districts" // Reset district when state changes
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    const defaultFilters: GeospatialFilterState = {
      state: "All States",
      district: "All Districts",
      threatCategory: "All Threat Categories",
      riskLevel: "All Risk Levels",
      timeRange: "Last 30 Days"
    }
    setFilters(defaultFilters)
    onApplyFilters(defaultFilters)
  }

  const activeFilterCount = [
    filters.state !== "All States",
    filters.district !== "All Districts",
    filters.threatCategory !== "All Threat Categories",
    filters.riskLevel !== "All Risk Levels",
    filters.timeRange !== "Last 30 Days"
  ].filter(Boolean).length

  return (
    <div className="flex flex-col h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 shadow-xl shadow-shield-cyan/5">
      
      {/* Header */}
      <div className="border-b border-shield-cyan/10 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-shield-cyan" />
            Intelligence Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-shield-cyan/20 text-[10px] font-bold text-shield-cyan">
              {activeFilterCount}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-shield-muted leading-relaxed">
          Refine geographic intelligence by region, threat category, severity, and reporting period.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="p-5 sm:p-6 space-y-5">
        
        {/* Region */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-shield-muted flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> Region
          </h3>
          <div className="space-y-2">
            <select 
              value={filters.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full rounded-md border border-shield-cyan/20 bg-shield-navy/40 px-3 py-2 text-sm text-white outline-none focus:border-shield-cyan/50 focus:ring-1 focus:ring-shield-cyan/50"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={filters.district}
              onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}
              disabled={filters.state === "All States"}
              className="w-full rounded-md border border-shield-cyan/20 bg-shield-navy/40 px-3 py-2 text-sm text-white outline-none focus:border-shield-cyan/50 focus:ring-1 focus:ring-shield-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Threat Category */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-shield-muted flex items-center gap-1.5">
            <Target className="h-3 w-3" /> Threat Category
          </h3>
          <select 
            value={filters.threatCategory}
            onChange={(e) => setFilters(f => ({ ...f, threatCategory: e.target.value as ThreatCategory }))}
            className="w-full rounded-md border border-shield-cyan/20 bg-shield-navy/40 px-3 py-2 text-sm text-white outline-none focus:border-shield-cyan/50 focus:ring-1 focus:ring-shield-cyan/50"
          >
            {[
              "All Threat Categories",
              "Digital Arrest Scam",
              "Phishing",
              "Fake UPI Request",
              "Investment Fraud",
              "Impersonation Scam",
              "OTP Fraud",
              "Counterfeit Currency",
              "Money Mule Activity"
            ].map(tc => <option key={tc} value={tc}>{tc}</option>)}
          </select>
        </div>

        {/* Risk Level */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-shield-muted flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Risk Level
          </h3>
          <select 
            value={filters.riskLevel}
            onChange={(e) => setFilters(f => ({ ...f, riskLevel: e.target.value as RiskLevel }))}
            className="w-full rounded-md border border-shield-cyan/20 bg-shield-navy/40 px-3 py-2 text-sm text-white outline-none focus:border-shield-cyan/50 focus:ring-1 focus:ring-shield-cyan/50"
          >
            {["All Risk Levels", "Low", "Medium", "High", "Critical"].map(rl => (
              <option key={rl} value={rl}>{rl}</option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-shield-muted flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Time Range
          </h3>
          <select 
            value={filters.timeRange}
            onChange={(e) => setFilters(f => ({ ...f, timeRange: e.target.value as TimeRange }))}
            className="w-full rounded-md border border-shield-cyan/20 bg-shield-navy/40 px-3 py-2 text-sm text-white outline-none focus:border-shield-cyan/50 focus:ring-1 focus:ring-shield-cyan/50"
          >
            {["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last 90 Days"].map(tr => (
              <option key={tr} value={tr}>{tr}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Actions */}
      <div className="border-t border-shield-cyan/10 p-5 sm:p-6 space-y-3 bg-shield-navy/30 rounded-b-xl">
        <Button
          onClick={handleApply}
          disabled={isApplying}
          className="w-full bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90 font-semibold"
        >
          {isApplying ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-shield-navy/20 border-t-shield-navy" />
              Applying Intelligence...
            </span>
          ) : (
            "Apply Intelligence Filters"
          )}
        </Button>
        <Button
          onClick={handleReset}
          disabled={isApplying}
          variant="outline"
          className="w-full border-shield-cyan/20 bg-transparent text-shield-cyan hover:bg-shield-cyan/10 hover:text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>

    </div>
  )
}
