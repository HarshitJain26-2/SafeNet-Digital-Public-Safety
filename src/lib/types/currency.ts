export type CurrencyDenomination = "₹100" | "₹200" | "₹500" | "₹2000"
export type CurrencyNoteSide = "Front" | "Reverse"
export type CaptureType = "Single Image" | "Front + Reverse"

export interface CurrencyInput {
  imageFile: File | null
  imagePreviewUrl: string | null
  denomination: CurrencyDenomination
  noteSide: CurrencyNoteSide
  captureType: CaptureType
}

export type FeatureStatus = "Consistent" | "Review" | "Inconsistency" | "Unknown"

export interface SecurityFeature {
  id: string
  name: string
  status: FeatureStatus
  observation: string
  confidence?: number // 0-100
}

export type CurrencyRiskLevel = "Low Risk" | "Review Recommended" | "High Risk"

export interface CurrencyAnalysisResult {
  riskLevel: CurrencyRiskLevel
  confidenceScore: number // 0-100 prototype value
  features: SecurityFeature[]
  evidence: string[]
}

export type CurrencyAnalysisState = 
  | "idle"
  | "preparing"
  | "detecting"
  | "inspecting"
  | "generating"
  | "complete"
  | "error"
