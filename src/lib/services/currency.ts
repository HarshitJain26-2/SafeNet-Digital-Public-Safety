import { CurrencyInput, CurrencyAnalysisState, CurrencyAnalysisResult } from "@/lib/types/currency"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * DEMO FRONTEND ANALYSIS — REPLACE WITH REAL MODEL RESPONSE
 * 
 * This function simulates an AI vision pipeline inspecting currency security features.
 * Replace this with actual calls to TensorFlow.js or Gemini Vision API in the future.
 */
const API_BASE = "http://localhost:8000/api/v1"

export async function analyzeCurrency(
  input: CurrencyInput,
  onStateChange: (state: CurrencyAnalysisState) => void
): Promise<CurrencyAnalysisResult> {
  
  onStateChange("preparing")
  
  if (!input.imageFile) {
    throw new Error("No image file provided for analysis.")
  }
  
  onStateChange("detecting")
  const formData = new FormData()
  formData.append("file", input.imageFile)
  formData.append("denomination", input.denomination)
  formData.append("note_side", input.noteSide)
  
  onStateChange("inspecting")
  const response = await fetch(`${API_BASE}/currency/analyze`, {
    method: "POST",
    body: formData,
  })
  
  onStateChange("generating")
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.message || `Currency verification failed with status ${response.status}`)
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to verify currency note")
  }
  
  onStateChange("complete")
  return result.data
}
