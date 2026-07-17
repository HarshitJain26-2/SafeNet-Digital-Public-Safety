import { CrimeHotspot, GeospatialFilterState, GeospatialAnalyticsSummary, ThreatTrendDataPoint } from "../types/geospatial"

// India states mapping for the filter
export const INDIAN_STATES: Record<string, string[]> = {
  "All States": ["All Districts"],
  "Maharashtra": ["All Districts", "Pune", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nashik", "Thane"],
  "Delhi": ["All Districts", "New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  "Karnataka": ["All Districts", "Bengaluru Urban", "Mysuru", "Hubballi"],
  "Uttar Pradesh": ["All Districts", "Lucknow", "Noida", "Kanpur", "Varanasi"],
  "Rajasthan": ["All Districts", "Jaipur", "Jodhpur", "Udaipur"],
  "Bihar": ["All Districts", "Patna", "Gaya", "Muzaffarpur"],
  "Jharkhand": ["All Districts", "Ranchi", "Jamtara", "Dhanbad"],
  "Telangana": ["All Districts", "Hyderabad", "Warangal", "Nizamabad"]
}

export const MOCK_HOTSPOTS: CrimeHotspot[] = [
  {
    id: "hs-pune",
    regionName: "Pune",
    stateName: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    riskScore: 88,
    riskLevel: "High",
    reportedIncidents: 184,
    primaryThreat: "Digital Arrest Scam",
    trend: "Increasing",
    threatDistribution: [
      { category: "Digital Arrest Scam", percentage: 45, count: 83 },
      { category: "Phishing", percentage: 25, count: 46 },
      { category: "Fake UPI Request", percentage: 15, count: 27 },
      { category: "Investment Fraud", percentage: 15, count: 28 },
    ],
    recommendation: {
      priority: "High",
      summary: "Pune district shows a high concentration of Digital Arrest Scam activity with increasing reports during the selected period. Prioritize public-awareness campaigns, review linked payment identifiers, monitor connected money-mule indicators, and allocate additional cybercrime investigation resources.",
      actions: [
        "Increase targeted cyber-awareness campaigns",
        "Review linked UPI IDs and phone numbers",
        "Monitor connected money-mule accounts",
        "Prioritize high-risk complaints",
        "Coordinate regional cybercrime resources"
      ]
    }
  },
  {
    id: "hs-mumbai",
    regionName: "Mumbai City",
    stateName: "Maharashtra",
    lat: 18.9387,
    lng: 72.8276,
    riskScore: 92,
    riskLevel: "Critical",
    reportedIncidents: 412,
    primaryThreat: "Investment Fraud",
    trend: "Stable",
    threatDistribution: [
      { category: "Investment Fraud", percentage: 38, count: 156 },
      { category: "Digital Arrest Scam", percentage: 22, count: 91 },
      { category: "Phishing", percentage: 20, count: 82 },
      { category: "Money Mule Activity", percentage: 20, count: 83 },
    ],
    recommendation: {
      priority: "High",
      summary: "Mumbai City displays critical levels of Investment Fraud linked to complex money-mule networks. Immediate financial intelligence coordination is recommended.",
      actions: [
        "Coordinate with banking nodal officers",
        "Trace high-value mule accounts",
        "Issue investor advisories"
      ]
    }
  },
  {
    id: "hs-delhi",
    regionName: "New Delhi",
    stateName: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    riskScore: 95,
    riskLevel: "Critical",
    reportedIncidents: 530,
    primaryThreat: "Impersonation Scam",
    trend: "Increasing",
    threatDistribution: [
      { category: "Impersonation Scam", percentage: 40, count: 212 },
      { category: "Digital Arrest Scam", percentage: 30, count: 159 },
      { category: "Phishing", percentage: 30, count: 159 },
    ],
    recommendation: {
      priority: "High",
      summary: "High volume of official-impersonation and digital arrest scams utilizing VoIP numbers.",
      actions: [
        "Coordinate with telecom operators for VoIP tracing",
        "Deploy automated voice-pattern warnings",
        "Establish fast-track FIR protocols"
      ]
    }
  },
  {
    id: "hs-bengaluru",
    regionName: "Bengaluru Urban",
    stateName: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    riskScore: 78,
    riskLevel: "High",
    reportedIncidents: 315,
    primaryThreat: "Fake UPI Request",
    trend: "Decreasing",
    threatDistribution: [
      { category: "Fake UPI Request", percentage: 50, count: 157 },
      { category: "OTP Fraud", percentage: 30, count: 95 },
      { category: "Phishing", percentage: 20, count: 63 },
    ],
    recommendation: {
      priority: "Medium",
      summary: "UPI-related fraud is prevalent but showing a slight downward trend following recent interventions.",
      actions: [
        "Continue payment gateway monitoring",
        "Promote merchant-side verification",
        "Analyze typical compromise timeframes"
      ]
    }
  },
  {
    id: "hs-jamtara",
    regionName: "Jamtara",
    stateName: "Jharkhand",
    lat: 23.9631,
    lng: 86.7979,
    riskScore: 85,
    riskLevel: "High",
    reportedIncidents: 240,
    primaryThreat: "Phishing",
    trend: "Stable",
    threatDistribution: [
      { category: "Phishing", percentage: 60, count: 144 },
      { category: "OTP Fraud", percentage: 40, count: 96 },
    ],
    recommendation: {
      priority: "Medium",
      summary: "Persistent phishing hub. Focus on localized network blocking and device-fingerprinting.",
      actions: [
        "Trace shared IMEI/IMSI devices",
        "Block identified fraudulent IP ranges"
      ]
    }
  },
  {
    id: "hs-hyderabad",
    regionName: "Hyderabad",
    stateName: "Telangana",
    lat: 17.3850,
    lng: 78.4867,
    riskScore: 65,
    riskLevel: "Medium",
    reportedIncidents: 150,
    primaryThreat: "OTP Fraud",
    trend: "Stable",
    threatDistribution: [
      { category: "OTP Fraud", percentage: 40, count: 60 },
      { category: "Investment Fraud", percentage: 35, count: 52 },
      { category: "Fake UPI Request", percentage: 25, count: 38 },
    ],
    recommendation: {
      priority: "Low",
      summary: "Moderate threat volume distributed across consumer scams.",
      actions: [
        "Maintain routine surveillance",
        "Update local advisory boards"
      ]
    }
  },
  {
    id: "hs-jaipur",
    regionName: "Jaipur",
    stateName: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    riskScore: 55,
    riskLevel: "Medium",
    reportedIncidents: 95,
    primaryThreat: "Counterfeit Currency",
    trend: "Increasing",
    threatDistribution: [
      { category: "Counterfeit Currency", percentage: 70, count: 66 },
      { category: "Impersonation Scam", percentage: 30, count: 29 },
    ],
    recommendation: {
      priority: "Medium",
      summary: "Emerging node for physical/digital hybrid threats, specifically counterfeit circulation.",
      actions: [
        "Deploy visual inspection guidelines to local merchants",
        "Track cross-state distribution routes"
      ]
    }
  },
  {
    id: "hs-lucknow",
    regionName: "Lucknow",
    stateName: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    riskScore: 42,
    riskLevel: "Low",
    reportedIncidents: 45,
    primaryThreat: "Fake UPI Request",
    trend: "Decreasing",
    threatDistribution: [
      { category: "Fake UPI Request", percentage: 100, count: 45 }
    ],
    recommendation: {
      priority: "Low",
      summary: "Low risk profile currently. Standard monitoring sufficient.",
      actions: [
        "Maintain current operations"
      ]
    }
  }
]

export const MOCK_TREND_DATA: ThreatTrendDataPoint[] = [
  { date: "May 01", "Digital Arrest Scam": 24, "Phishing": 45, "Fake UPI Request": 80 },
  { date: "May 05", "Digital Arrest Scam": 35, "Phishing": 42, "Fake UPI Request": 75 },
  { date: "May 10", "Digital Arrest Scam": 55, "Phishing": 38, "Fake UPI Request": 60 },
  { date: "May 15", "Digital Arrest Scam": 85, "Phishing": 35, "Fake UPI Request": 55 },
  { date: "May 20", "Digital Arrest Scam": 110, "Phishing": 40, "Fake UPI Request": 50 },
  { date: "May 25", "Digital Arrest Scam": 135, "Phishing": 45, "Fake UPI Request": 42 },
  { date: "May 30", "Digital Arrest Scam": 150, "Phishing": 48, "Fake UPI Request": 38 },
]

const API_BASE = "http://localhost:8000/api/v1"

export async function filterGeospatialData(filters: GeospatialFilterState): Promise<{
  hotspots: CrimeHotspot[],
  summary: GeospatialAnalyticsSummary,
  trends: ThreatTrendDataPoint[]
}> {
  const response = await fetch(`${API_BASE}/geo/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: filters.state,
      district: filters.district,
      threatCategory: filters.threatCategory,
      riskLevel: filters.riskLevel,
      timeRange: filters.timeRange,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.message || `Geospatial filtering failed with status ${response.status}`)
  }

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to retrieve geospatial data")
  }

  return {
    hotspots: result.data.hotspots,
    summary: result.data.summary,
    trends: result.data.trends,
  }
}
