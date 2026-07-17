export type ThreatCategory = 
  | "All Threat Categories"
  | "Digital Arrest Scam"
  | "Phishing"
  | "Fake UPI Request"
  | "Investment Fraud"
  | "Impersonation Scam"
  | "OTP Fraud"
  | "Counterfeit Currency"
  | "Money Mule Activity"

export type RiskLevel = "All Risk Levels" | "Low" | "Medium" | "High" | "Critical"
export type TimeRange = "Last 24 Hours" | "Last 7 Days" | "Last 30 Days" | "Last 90 Days"
export type TrendDirection = "Increasing" | "Stable" | "Decreasing"

export interface GeospatialFilterState {
  state: string
  district: string
  threatCategory: ThreatCategory
  riskLevel: RiskLevel
  timeRange: TimeRange
}

export interface ThreatDistribution {
  category: ThreatCategory
  percentage: number
  count: number
}

export interface AIRecommendation {
  priority: "High" | "Medium" | "Low"
  summary: string
  actions: string[]
}

export interface CrimeHotspot {
  id: string
  regionName: string // e.g. "Pune"
  stateName: string // e.g. "Maharashtra"
  lat: number
  lng: number
  riskScore: number // 0-100
  riskLevel: Exclude<RiskLevel, "All Risk Levels">
  reportedIncidents: number
  primaryThreat: ThreatCategory
  trend: TrendDirection
  threatDistribution: ThreatDistribution[]
  recommendation: AIRecommendation
}

export interface GeospatialAnalyticsSummary {
  totalIncidents: number
  incidentTrendPercent: number
  highRiskZones: number
  emergingHotspots: number
  avgResponseTimeMin: number
}

export interface ThreatTrendDataPoint {
  date: string
  "Digital Arrest Scam": number
  "Phishing": number
  "Fake UPI Request": number
  [key: string]: string | number
}

export interface RegionalIntelligenceBrief {
  hotspot: CrimeHotspot
  generatedAt: string
}
