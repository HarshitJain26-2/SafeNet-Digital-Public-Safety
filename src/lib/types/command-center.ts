export type RiskLevel = "Critical" | "High" | "Medium" | "Low"
export type CaseStatus = "Immediate Review" | "Network Review" | "Analyst Assigned" | "Under Review" | "Evidence Review" | "Escalated" | "Resolved"

export interface CommandCase {
  id: string
  threatCategory: string
  location: string
  lat: number
  lng: number
  riskScore: number
  riskLevel: RiskLevel
  status: CaseStatus
  reportedAt: string
  trend: "Increasing" | "Stable" | "Decreasing"
  reportedCases: number
  indicators: string[]
  recommendedActions: string[]
}

export interface DashboardMetrics {
  activeCases: { value: number, addedToday: number }
  criticalAlerts: { value: number }
  highRiskEntities: { value: number }
  emergingHotspots: { value: number, increasingRapidly: number }
  avgResponseTimeMin: number
}

export interface CrossModuleActivity {
  id: string
  moduleName: "Citizen Fraud Shield" | "Fraud Network Analysis" | "Geospatial Crime Intelligence" | "Currency Verification"
  summary: string
  caseId?: string
  timeAgo: string
  severity: "Critical" | "High" | "Medium" | "Low"
}

export interface AnalyticsTrendPoint {
  date: string
  "Digital Arrest Scam": number
  "Investment Fraud": number
  "Fake UPI Request": number
  "Phishing": number
  [key: string]: string | number
}

export interface AnalyticsDistribution {
  category: string
  percentage: number
}

export interface InvestigationStatusCounts {
  underReview: number
  analystAssigned: number
  evidenceReview: number
  escalated: number
  resolved: number
}
