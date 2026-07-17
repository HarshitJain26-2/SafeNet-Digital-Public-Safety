import { CommandCase, DashboardMetrics, CrossModuleActivity, AnalyticsTrendPoint, AnalyticsDistribution, InvestigationStatusCounts } from "../types/command-center"

export const MOCK_COMMAND_METRICS: DashboardMetrics = {
  activeCases: { value: 247, addedToday: 18 },
  criticalAlerts: { value: 12 },
  highRiskEntities: { value: 86 },
  emergingHotspots: { value: 5, increasingRapidly: 3 },
  avgResponseTimeMin: 4.8
}

export const MOCK_COMMAND_CASES: CommandCase[] = [
  {
    id: "SA-2026-04892",
    threatCategory: "Digital Arrest Scam",
    location: "Pune, Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    riskScore: 94,
    riskLevel: "Critical",
    status: "Immediate Review",
    reportedAt: "2026-07-16T08:24:00Z",
    trend: "Increasing",
    reportedCases: 148,
    indicators: [
      "Government-officer impersonation",
      "Urgent payment demand",
      "Coordinated communication pattern",
      "Urgency and fear language"
    ],
    recommendedActions: [
      "Review associated communication evidence",
      "Verify linked payment identifiers",
      "Compare entities with existing investigations",
      "Preserve submitted evidence",
      "Escalate for authorized human review"
    ]
  },
  {
    id: "SA-2026-04876",
    threatCategory: "Investment Fraud Network",
    location: "Mumbai, Maharashtra",
    lat: 18.9387,
    lng: 72.8276,
    riskScore: 91,
    riskLevel: "Critical",
    status: "Network Review",
    reportedAt: "2026-07-16T07:15:00Z",
    trend: "Stable",
    reportedCases: 412,
    indicators: [
      "Multiple linked beneficiary accounts",
      "Rapid transaction movement",
      "High-risk entity connections"
    ],
    recommendedActions: [
      "Trace high-value mule accounts",
      "Coordinate with banking nodal officers",
      "Freeze secondary linked accounts"
    ]
  },
  {
    id: "SA-2026-04899",
    threatCategory: "Impersonation Scam",
    location: "New Delhi, Delhi",
    lat: 28.6139,
    lng: 77.2090,
    riskScore: 95,
    riskLevel: "Critical",
    status: "Immediate Review",
    reportedAt: "2026-07-16T09:10:00Z",
    trend: "Increasing",
    reportedCases: 210,
    indicators: [
      "VoIP international numbering routing",
      "Customs official script match",
      "Fake warrant generated"
    ],
    recommendedActions: [
      "Issue telecom VoIP block request",
      "Notify local cyber cell",
      "Cross-reference caller ID patterns"
    ]
  },
  {
    id: "SA-2026-04861",
    threatCategory: "Fake UPI Request",
    location: "Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    riskScore: 87,
    riskLevel: "High",
    status: "Analyst Assigned",
    reportedAt: "2026-07-15T18:45:00Z",
    trend: "Stable",
    reportedCases: 315,
    indicators: [
      "Suspicious payment request",
      "Repeated sender activity",
      "Merchant naming spoof"
    ],
    recommendedActions: [
      "Review payment gateway logs",
      "Contact receiving bank nodal officer"
    ]
  },
  {
    id: "SA-2026-04850",
    threatCategory: "Phishing Network",
    location: "Jamtara, Jharkhand",
    lat: 23.9631,
    lng: 86.7979,
    riskScore: 85,
    riskLevel: "High",
    status: "Under Review",
    reportedAt: "2026-07-15T14:20:00Z",
    trend: "Stable",
    reportedCases: 240,
    indicators: [
      "Mass SMS dispatch detected",
      "Bank URL spoofing",
      "Shared device identifiers"
    ],
    recommendedActions: [
      "Initiate domain takedown request",
      "Flag associated sender IDs"
    ]
  },
  {
    id: "SA-2026-04830",
    threatCategory: "OTP Fraud",
    location: "Hyderabad, Telangana",
    lat: 17.3850,
    lng: 78.4867,
    riskScore: 65,
    riskLevel: "Medium",
    status: "Evidence Review",
    reportedAt: "2026-07-14T11:10:00Z",
    trend: "Decreasing",
    reportedCases: 150,
    indicators: [
      "Screen sharing app installation",
      "Simultaneous bank login"
    ],
    recommendedActions: [
      "Confirm device binding status",
      "Analyze session IP footprint"
    ]
  },
  {
    id: "SA-2026-04855",
    threatCategory: "Counterfeit Currency",
    location: "Jaipur, Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    riskScore: 55,
    riskLevel: "Medium",
    status: "Under Review",
    reportedAt: "2026-07-16T10:05:00Z",
    trend: "Increasing",
    reportedCases: 95,
    indicators: [
      "Missing security thread micro-text",
      "Inconsistent intaglio printing",
      "Failed UV fluorescence check"
    ],
    recommendedActions: [
      "Dispatch physical verification team",
      "Alert local merchant associations"
    ]
  }
]

export const MOCK_CROSS_MODULE_ACTIVITY: CrossModuleActivity[] = [
  {
    id: "act-1",
    moduleName: "Citizen Fraud Shield",
    summary: "Digital-arrest message classified as critical risk",
    caseId: "SA-2026-04892",
    timeAgo: "2 minutes ago",
    severity: "Critical"
  },
  {
    id: "act-2",
    moduleName: "Fraud Network Analysis",
    summary: "12 connected entities identified across 4 transaction clusters",
    caseId: "SA-2026-04876",
    timeAgo: "8 minutes ago",
    severity: "High"
  },
  {
    id: "act-3",
    moduleName: "Geospatial Crime Intelligence",
    summary: "Emerging digital-arrest hotspot detected in Pune",
    timeAgo: "14 minutes ago",
    severity: "High"
  },
  {
    id: "act-4",
    moduleName: "Currency Verification",
    summary: "₹500 note flagged for additional manual security-feature review",
    caseId: "SA-2026-04855",
    timeAgo: "21 minutes ago",
    severity: "Medium"
  }
]

export const MOCK_COMMAND_TRENDS: AnalyticsTrendPoint[] = [
  { date: "May 01", "Digital Arrest Scam": 24, "Investment Fraud": 30, "Fake UPI Request": 80, "Phishing": 45 },
  { date: "May 05", "Digital Arrest Scam": 35, "Investment Fraud": 45, "Fake UPI Request": 75, "Phishing": 42 },
  { date: "May 10", "Digital Arrest Scam": 55, "Investment Fraud": 70, "Fake UPI Request": 60, "Phishing": 38 },
  { date: "May 15", "Digital Arrest Scam": 85, "Investment Fraud": 90, "Fake UPI Request": 55, "Phishing": 35 },
  { date: "May 20", "Digital Arrest Scam": 110, "Investment Fraud": 120, "Fake UPI Request": 50, "Phishing": 40 },
  { date: "May 25", "Digital Arrest Scam": 135, "Investment Fraud": 140, "Fake UPI Request": 42, "Phishing": 45 },
  { date: "May 30", "Digital Arrest Scam": 150, "Investment Fraud": 160, "Fake UPI Request": 38, "Phishing": 48 },
]

export const MOCK_COMMAND_DISTRIBUTION: AnalyticsDistribution[] = [
  { category: "Digital Arrest Scam", percentage: 31 },
  { category: "Investment Fraud", percentage: 24 },
  { category: "Fake UPI Requests", percentage: 19 },
  { category: "Phishing", percentage: 15 },
  { category: "Counterfeit Currency", percentage: 11 },
]

export const MOCK_INVESTIGATION_STATUS: InvestigationStatusCounts = {
  underReview: 86,
  analystAssigned: 72,
  evidenceReview: 48,
  escalated: 23,
  resolved: 164
}

const API_BASE = "http://localhost:8000/api/v1"

export async function fetchCommandData() {
  try {
    const [dbRes, analyticsRes] = await Promise.all([
      fetch(`${API_BASE}/dashboard`),
      fetch(`${API_BASE}/dashboard/analytics`)
    ])

    if (!dbRes.ok || !analyticsRes.ok) {
      throw new Error("Failed to fetch dashboard data from API")
    }

    const dbJson = await dbRes.json()
    const analyticsJson = await analyticsRes.json()

    if (!dbJson.success || !analyticsJson.success) {
      throw new Error("API reports failure in dashboard fetch")
    }

    const dbData = dbJson.data
    const analyticsData = analyticsJson.data

    // If there is no live data in the session store yet, use MOCK fallbacks
    const hasLiveData = dbData.metrics.activeCases.value > 0
    
    const metrics = hasLiveData ? dbData.metrics : MOCK_COMMAND_METRICS
    const cases = hasLiveData ? dbData.cases : MOCK_COMMAND_CASES
    const activity = hasLiveData ? dbData.activity : MOCK_CROSS_MODULE_ACTIVITY
    const trends = hasLiveData ? (analyticsData.trends || []) : MOCK_COMMAND_TRENDS
    const distribution = hasLiveData ? (analyticsData.threatDistribution || []) : MOCK_COMMAND_DISTRIBUTION
    const statusCounts = hasLiveData ? (analyticsData.statusCounts || MOCK_INVESTIGATION_STATUS) : MOCK_INVESTIGATION_STATUS

    return {
      metrics,
      cases,
      activity,
      trends,
      distribution,
      statusCounts
    }
  } catch (error) {
    console.error("Dashboard API integration failed, falling back to mock data:", error)
    return {
      metrics: MOCK_COMMAND_METRICS,
      cases: MOCK_COMMAND_CASES,
      activity: MOCK_CROSS_MODULE_ACTIVITY,
      trends: MOCK_COMMAND_TRENDS,
      distribution: MOCK_COMMAND_DISTRIBUTION,
      statusCounts: MOCK_INVESTIGATION_STATUS
    }
  }
}
