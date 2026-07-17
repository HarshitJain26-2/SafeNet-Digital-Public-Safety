export type EntityType = 
  | "Suspected Coordinator"
  | "Potential Money Mule"
  | "High-Risk Account"
  | "Victim"
  | "Phone Number"
  | "UPI ID"
  | "Bank Account"
  | "Merchant"
  | "Unknown Entity"

export type RiskLevel = "High" | "Medium" | "Low" | "Unknown"

export interface FraudEntity {
  id: string
  label: string
  type: EntityType
  riskLevel: RiskLevel
  riskScore: number // 0-100
  incomingValue?: string
  outgoingValue?: string
  transactionCount?: number
  callFrequency?: number
  firstObserved?: string
  lastObserved?: string
  x: number // SVG X coordinate
  y: number // SVG Y coordinate
  indicators: EntityRiskIndicator[]
  connectedEntitiesCount: number
}

export interface EntityRiskIndicator {
  id: string
  label: string
  explanation: string
  severity: "High" | "Medium" | "Low"
}

export type RelationshipType = 
  | "Transaction"
  | "Call"
  | "Repeated Contact"
  | "Shared Device"
  | "Shared Location"
  | "Linked UPI"
  | "Common Beneficiary"

export interface FraudRelationship {
  id: string
  sourceId: string
  targetId: string
  type: RelationshipType
  weight: number // 1-5 line thickness/opacity indicator
  details?: string
  amount?: string
  firstObserved?: string
  lastObserved?: string
}

export interface FraudCluster {
  id: string
  label: string
  entityCount: number
  relationshipCount: number
  riskLevel: RiskLevel
  pattern: string
  centralEntityId: string
  totalValue?: string
}

export type EventType = "Transaction" | "Call" | "Connection" | "Alert"

export interface EvidenceTimelineEvent {
  id: string
  timestamp: string
  type: EventType
  description: string
  entityId?: string
  amount?: string
  source: string
  riskIndicator?: string
}

export interface InvestigationRecommendation {
  id: string
  priority: "High" | "Medium" | "Low"
  action: string
  reason: string
  targetEntityId?: string
  targetClusterId?: string
}

export interface InvestigationSummary {
  overview: string
  totalEntities: number
  totalRelationships: number
  clustersIdentified: number
  highPriorityEntities: number
  potentialMules: number
  connectedVictims: number
  totalAnalyzedValue: string
  keyPatterns: string[]
}

export interface InvestigationDataset {
  entities: FraudEntity[]
  relationships: FraudRelationship[]
  clusters: FraudCluster[]
  timeline: EvidenceTimelineEvent[]
  summary: InvestigationSummary
  recommendations: InvestigationRecommendation[]
}

export type NetworkAnalysisState = 
  | "idle"
  | "validating"
  | "extracting"
  | "building"
  | "identifying"
  | "calculating"
  | "preparing"
  | "complete"
  | "error"
