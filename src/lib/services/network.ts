import { 
  InvestigationDataset, 
  NetworkAnalysisState, 
  FraudEntity, 
  FraudRelationship, 
  FraudCluster, 
  EvidenceTimelineEvent, 
  InvestigationRecommendation, 
  InvestigationSummary 
} from "@/lib/types/network"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * DEMO FRONTEND GRAPH ANALYSIS — REPLACE WITH REAL ANALYSIS SERVICE
 * 
 * This contains a synthetic dataset pre-calculated for the React+SVG graph layout.
 * In a production scenario, you would pass the CSV file to a backend (e.g., Python NetworkX, Neo4j, or an LLM)
 * and it would return nodes, edges, and clusters, potentially with dynamic force-directed layout coordinates.
 */

// Define entities with pre-calculated X,Y coordinates for a static SVG canvas (800x600 coordinate space)
const DEMO_ENTITIES: FraudEntity[] = [
  // Central Hub (Coordinator)
  { id: "ACC-1048", label: "ACC-1048", type: "Suspected Coordinator", riskLevel: "High", riskScore: 94, x: 400, y: 300, incomingValue: "₹4,250,000", outgoingValue: "₹4,100,000", transactionCount: 142, firstObserved: "2024-05-12", lastObserved: "2024-05-24", connectedEntitiesCount: 8, indicators: [
    { id: "ind-1", label: "Central Network Position", explanation: "Acts as a primary aggregation hub for funds from multiple unrelated sources.", severity: "High" },
    { id: "ind-2", label: "Rapid Onward Transfer", explanation: "Over 85% of incoming funds are transferred out within 30 minutes.", severity: "High" }
  ]},
  
  // Cluster 1 (Left side) - Potential Mules & Victims
  { id: "ACC-2087", label: "ACC-2087", type: "Potential Money Mule", riskLevel: "Medium", riskScore: 68, x: 250, y: 200, incomingValue: "₹450,000", outgoingValue: "₹448,000", transactionCount: 12, connectedEntitiesCount: 4, indicators: [
    { id: "ind-3", label: "Pass-through Account", explanation: "Receives funds from suspected victims and immediately forwards to ACC-1048.", severity: "Medium" }
  ]},
  { id: "VICTIM-03", label: "VICTIM-03", type: "Victim", riskLevel: "Low", riskScore: 10, x: 100, y: 150, outgoingValue: "₹150,000", transactionCount: 2, connectedEntitiesCount: 1, indicators: []},
  { id: "VICTIM-08", label: "VICTIM-08", type: "Victim", riskLevel: "Low", riskScore: 12, x: 120, y: 250, outgoingValue: "₹300,000", transactionCount: 3, connectedEntitiesCount: 2, indicators: []},
  { id: "PHONE-DEMO-07", label: "PHONE-07", type: "Phone Number", riskLevel: "Medium", riskScore: 55, x: 200, y: 100, callFrequency: 45, connectedEntitiesCount: 3, indicators: [
    { id: "ind-4", label: "Repeated Contact Pattern", explanation: "High frequency of short-duration calls matching scam interaction profiles.", severity: "Medium" }
  ]},
  
  // Cluster 2 (Top Right)
  { id: "UPI-DEMO-14", label: "UPI-14", type: "UPI ID", riskLevel: "High", riskScore: 82, x: 550, y: 180, incomingValue: "₹850,000", outgoingValue: "₹850,000", transactionCount: 34, connectedEntitiesCount: 5, indicators: [
    { id: "ind-5", label: "Shared Device Pattern", explanation: "UPI ID has been accessed from multiple conflicting IP addresses.", severity: "High" }
  ]},
  { id: "VICTIM-12", label: "VICTIM-12", type: "Victim", riskLevel: "Low", riskScore: 5, x: 700, y: 120, outgoingValue: "₹120,000", transactionCount: 1, connectedEntitiesCount: 1, indicators: []},
  { id: "VICTIM-14", label: "VICTIM-14", type: "Victim", riskLevel: "Low", riskScore: 8, x: 680, y: 220, outgoingValue: "₹240,000", transactionCount: 4, connectedEntitiesCount: 1, indicators: []},
  
  // Cluster 3 (Bottom) - Merchants and withdrawal points
  { id: "MERCH-992", label: "MERCH-992", type: "Merchant", riskLevel: "Medium", riskScore: 60, x: 400, y: 480, incomingValue: "₹1,200,000", transactionCount: 45, connectedEntitiesCount: 3, indicators: [
    { id: "ind-6", label: "Atypical Merchant Volume", explanation: "High volume of exact-amount transactions inconsistent with typical retail behavior.", severity: "Medium" }
  ]},
  { id: "ACC-5521", label: "ACC-5521", type: "High-Risk Account", riskLevel: "High", riskScore: 88, x: 280, y: 420, incomingValue: "₹900,000", outgoingValue: "₹880,000", transactionCount: 28, connectedEntitiesCount: 4, indicators: [
    { id: "ind-7", label: "Linked to Known Threats", explanation: "Account owner details partially match historical fraud watchlists.", severity: "High" }
  ]},
  { id: "PHONE-DEMO-12", label: "PHONE-12", type: "Phone Number", riskLevel: "High", riskScore: 78, x: 550, y: 400, callFrequency: 112, connectedEntitiesCount: 3, indicators: [
    { id: "ind-8", label: "Burner Phone Profile", explanation: "High volume outbound calls, no inbound duration. Disconnected frequently.", severity: "High" }
  ]},
  
  // Peripheral Nodes
  { id: "ACC-9901", label: "ACC-9901", type: "Unknown Entity", riskLevel: "Unknown", riskScore: 20, x: 150, y: 380, connectedEntitiesCount: 1, indicators: []},
  { id: "ACC-9902", label: "ACC-9902", type: "Unknown Entity", riskLevel: "Unknown", riskScore: 25, x: 650, y: 350, connectedEntitiesCount: 1, indicators: []},
  { id: "VICTIM-22", label: "VICTIM-22", type: "Victim", riskLevel: "Low", riskScore: 5, x: 650, y: 500, connectedEntitiesCount: 1, indicators: []},
  { id: "VICTIM-23", label: "VICTIM-23", type: "Victim", riskLevel: "Low", riskScore: 5, x: 250, y: 550, connectedEntitiesCount: 1, indicators: []},
  { id: "UPI-DEMO-02", label: "UPI-02", type: "UPI ID", riskLevel: "Medium", riskScore: 45, x: 500, y: 520, connectedEntitiesCount: 2, indicators: []},
]

const DEMO_RELATIONSHIPS: FraudRelationship[] = [
  // Cluster 1 connections
  { id: "rel-1", sourceId: "VICTIM-03", targetId: "ACC-2087", type: "Transaction", weight: 2, amount: "₹150,000" },
  { id: "rel-2", sourceId: "VICTIM-08", targetId: "ACC-2087", type: "Transaction", weight: 3, amount: "₹300,000" },
  { id: "rel-3", sourceId: "PHONE-DEMO-07", targetId: "VICTIM-03", type: "Call", weight: 1, details: "12 calls prior to transaction" },
  { id: "rel-4", sourceId: "PHONE-DEMO-07", targetId: "VICTIM-08", type: "Call", weight: 1, details: "5 calls prior to transaction" },
  { id: "rel-5", sourceId: "ACC-2087", targetId: "ACC-1048", type: "Transaction", weight: 4, amount: "₹448,000", details: "Transferred within 5 mins of receipt" },
  
  // Cluster 2 connections
  { id: "rel-6", sourceId: "VICTIM-12", targetId: "UPI-DEMO-14", type: "Transaction", weight: 2, amount: "₹120,000" },
  { id: "rel-7", sourceId: "VICTIM-14", targetId: "UPI-DEMO-14", type: "Transaction", weight: 3, amount: "₹240,000" },
  { id: "rel-8", sourceId: "UPI-DEMO-14", targetId: "ACC-1048", type: "Transaction", weight: 4, amount: "₹850,000" },
  { id: "rel-9", sourceId: "PHONE-DEMO-07", targetId: "UPI-DEMO-14", type: "Shared Device", weight: 2 },
  
  // Cluster 3 & Outbound connections
  { id: "rel-10", sourceId: "ACC-1048", targetId: "MERCH-992", type: "Transaction", weight: 5, amount: "₹1,200,000" },
  { id: "rel-11", sourceId: "ACC-1048", targetId: "ACC-5521", type: "Transaction", weight: 4, amount: "₹900,000" },
  { id: "rel-12", sourceId: "PHONE-DEMO-12", targetId: "MERCH-992", type: "Common Beneficiary", weight: 2 },
  { id: "rel-13", sourceId: "PHONE-DEMO-12", targetId: "ACC-1048", type: "Repeated Contact", weight: 3 },
  { id: "rel-14", sourceId: "ACC-5521", targetId: "MERCH-992", type: "Transaction", weight: 3, amount: "₹850,000" },
  
  // Peripheral connections
  { id: "rel-15", sourceId: "ACC-9901", targetId: "ACC-5521", type: "Transaction", weight: 1 },
  { id: "rel-16", sourceId: "ACC-1048", targetId: "ACC-9902", type: "Transaction", weight: 2, amount: "₹350,000" },
  { id: "rel-17", sourceId: "PHONE-DEMO-12", targetId: "VICTIM-22", type: "Call", weight: 1 },
  { id: "rel-18", sourceId: "VICTIM-22", targetId: "UPI-DEMO-02", type: "Transaction", weight: 1 },
  { id: "rel-19", sourceId: "UPI-DEMO-02", targetId: "MERCH-992", type: "Transaction", weight: 2 },
  { id: "rel-20", sourceId: "VICTIM-23", targetId: "ACC-5521", type: "Transaction", weight: 1 },
]

const DEMO_CLUSTERS: FraudCluster[] = [
  { id: "cluster-1", label: "Multi-Victim Collection Pattern", entityCount: 4, relationshipCount: 5, riskLevel: "Medium", pattern: "Multiple small inflows consolidating into a single pass-through account.", centralEntityId: "ACC-2087", totalValue: "₹450,000" },
  { id: "cluster-2", label: "Rapid Transfer Pattern", entityCount: 3, relationshipCount: 3, riskLevel: "High", pattern: "Digital payments rapidly forwarded to the main coordinator.", centralEntityId: "UPI-DEMO-14", totalValue: "₹850,000" },
  { id: "cluster-3", label: "Atypical Withdrawal Pattern", entityCount: 4, relationshipCount: 5, riskLevel: "High", pattern: "Funds exiting the network via a high-volume merchant and connected high-risk account.", centralEntityId: "MERCH-992", totalValue: "₹2,050,000" }
]

const DEMO_TIMELINE: EvidenceTimelineEvent[] = [
  { id: "t-1", timestamp: "09:02 May 12", type: "Call", description: "Repeated calls matching scam patterns detected.", entityId: "PHONE-DEMO-07", source: "Call Records" },
  { id: "t-2", timestamp: "09:15 May 12", type: "Transaction", description: "Funds transferred from victim to pass-through account.", entityId: "ACC-2087", amount: "₹150,000", source: "Bank Records" },
  { id: "t-3", timestamp: "09:18 May 12", type: "Transaction", description: "Rapid onward transfer to central coordinator.", entityId: "ACC-1048", amount: "₹148,000", source: "Bank Records", riskIndicator: "Rapid Onward Transfer" },
  { id: "t-4", timestamp: "11:45 May 14", type: "Alert", description: "Device fingerprint match between UPI and Phone.", entityId: "UPI-DEMO-14", source: "Device Intelligence", riskIndicator: "Shared Device Pattern" },
  { id: "t-5", timestamp: "14:20 May 16", type: "Transaction", description: "Large withdrawal event via merchant.", entityId: "MERCH-992", amount: "₹1,200,000", source: "Bank Records", riskIndicator: "Atypical Volume" }
]

const DEMO_SUMMARY: InvestigationSummary = {
  overview: "Network analysis reveals a highly organized structure centered around ACC-1048, acting as a primary aggregation hub. Funds are sourced from multiple victims through pass-through accounts and UPI IDs, before exiting via merchant endpoints.",
  totalEntities: DEMO_ENTITIES.length,
  totalRelationships: DEMO_RELATIONSHIPS.length,
  clustersIdentified: DEMO_CLUSTERS.length,
  highPriorityEntities: 4,
  potentialMules: 1,
  connectedVictims: 6,
  totalAnalyzedValue: "₹4,250,000",
  keyPatterns: [
    "Rapid onward transfers (under 30 mins) from collection nodes.",
    "Shared device fingerprints linking communication and transaction layers.",
    "Atypical high-value transactions at specific merchant endpoints."
  ]
}

const DEMO_RECOMMENDATIONS: InvestigationRecommendation[] = [
  { id: "rec-1", priority: "High", action: "Escalate for authorized account review", reason: "ACC-1048 exhibits extreme centrality and rapid-transfer behavior typical of a primary collection hub.", targetEntityId: "ACC-1048" },
  { id: "rec-2", priority: "High", action: "Verify ownership and KYC", reason: "Merchant MERCH-992 is processing volumes inconsistent with its registered profile, potentially acting as a cash-out point.", targetEntityId: "MERCH-992" },
  { id: "rec-3", priority: "Medium", action: "Preserve relevant transaction and communication evidence", reason: "Device overlap identified between UPI-DEMO-14 and communication endpoints.", targetClusterId: "cluster-2" }
]

export const SAMPLE_DATASET: InvestigationDataset = {
  entities: DEMO_ENTITIES,
  relationships: DEMO_RELATIONSHIPS,
  clusters: DEMO_CLUSTERS,
  timeline: DEMO_TIMELINE,
  summary: DEMO_SUMMARY,
  recommendations: DEMO_RECOMMENDATIONS
}

const API_BASE = "http://localhost:8000/api/v1"

export async function analyzeNetworkDataset(
  csvContent: string, 
  onStateChange: (state: NetworkAnalysisState) => void
): Promise<InvestigationDataset> {
  onStateChange("validating")
  
  const file = new File([csvContent], "network_data.csv", { type: "text/csv" })
  const formData = new FormData()
  formData.append("file", file)
  
  onStateChange("extracting")
  onStateChange("building")
  
  const response = await fetch(`${API_BASE}/network/upload`, {
    method: "POST",
    body: formData,
  })
  
  onStateChange("identifying")
  onStateChange("calculating")
  onStateChange("preparing")
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.message || `Network analysis failed with status ${response.status}`)
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to analyze network")
  }
  
  onStateChange("complete")
  return result.data
}
