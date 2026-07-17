export type InputSource = "WhatsApp" | "SMS" | "Email" | "Voice" | "Payment Request" | "Other"

export interface ThreatInput {
  source: InputSource
  text: string
  file?: File | null
  phoneNumber?: string
  upiId?: string
  url?: string
}

export type AnalysisState = 
  | "idle" 
  | "validating" 
  | "extracting" 
  | "analyzing" 
  | "classifying" 
  | "recommending" 
  | "complete" 
  | "error"

export type ThreatLevel = "Safe" | "Caution" | "Suspicious" | "High-Risk" | "Critical"

export type ScamCategory = 
  | "Digital Arrest Scam"
  | "Government Impersonation"
  | "Phishing"
  | "Fake UPI Request"
  | "OTP Fraud"
  | "Investment Fraud"
  | "Job Scam"
  | "Loan Scam"
  | "KYC Scam"
  | "Lottery Scam"
  | "Tech-Support Scam"
  | "Unknown / Requires Review"
  | "Safe Communication"

export type Severity = "Critical" | "High" | "Medium" | "Informational"

export interface EvidenceIndicator {
  label: string
  severity: Severity
  explanation: string
}

export interface DetectedEntity {
  type: string
  value: string
  copyable: boolean
}

export interface ThreatVerdict {
  level: ThreatLevel
  score: number // 0-100
  confidence: number // 0-100
  category: ScamCategory
  assessment: string
  evidence: EvidenceIndicator[]
  entities: DetectedEntity[]
  recommendations: string[]
  timestamp: string
}
