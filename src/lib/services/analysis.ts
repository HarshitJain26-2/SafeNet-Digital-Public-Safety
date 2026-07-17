import { AnalysisState, ThreatInput, ThreatVerdict } from "@/lib/types/citizen"

const API_BASE = "http://localhost:8000/api/v1"

export async function analyzeThreat(
  input: ThreatInput,
  onStateChange: (state: AnalysisState) => void
): Promise<ThreatVerdict> {
  onStateChange("validating")
  
  let response: Response
  
  if (input.file) {
    onStateChange("analyzing")
    const formData = new FormData()
    formData.append("file", input.file)
    
    const endpoint = input.source === "Voice" ? "/fraud/analyze-voice" : "/fraud/analyze-image"
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: formData,
    })
  } else {
    onStateChange("extracting")
    const payload = {
      source: input.source,
      text: input.text,
      phoneNumber: input.phoneNumber || null,
      upiId: input.upiId || null,
      url: input.url || null,
    }
    
    onStateChange("analyzing")
    response = await fetch(`${API_BASE}/fraud/analyze-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  }
  
  onStateChange("classifying")
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.message || `API analysis failed with status ${response.status}`)
  }
  
  onStateChange("recommending")
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to analyze threat")
  }
  
  onStateChange("complete")
  return result.data
}
}
