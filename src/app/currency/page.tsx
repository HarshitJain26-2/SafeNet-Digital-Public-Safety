"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CurrencyInputPanel } from "@/components/currency/currency-input-panel"
import { CurrencyPreviewPanel } from "@/components/currency/currency-preview-panel"
import { CurrencyIntelligencePanel } from "@/components/currency/currency-intelligence-panel"
import { CurrencyInput, CurrencyAnalysisState, CurrencyAnalysisResult } from "@/lib/types/currency"
import { analyzeCurrency } from "@/lib/services/currency"
import { ShieldCheck, Cpu, Eye } from "lucide-react"

export default function CurrencyPage() {
  const [input, setInput] = useState<CurrencyInput>({
    imageFile: null,
    imagePreviewUrl: null,
    denomination: "₹500",
    noteSide: "Front",
    captureType: "Single Image"
  })
  
  const [analysisState, setAnalysisState] = useState<CurrencyAnalysisState>("idle")
  const [result, setResult] = useState<CurrencyAnalysisResult | null>(null)

  const handleInputChange = (updates: Partial<CurrencyInput>) => {
    setInput(prev => {
      // If we're removing the image, we should revoke the object URL to avoid memory leaks
      if (updates.imagePreviewUrl === null && prev.imagePreviewUrl) {
        URL.revokeObjectURL(prev.imagePreviewUrl)
      }
      return { ...prev, ...updates }
    })
    
    // Reset analysis state if input changes
    if (analysisState !== "idle") {
      setAnalysisState("idle")
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!input.imageFile) return
    
    setResult(null)
    setAnalysisState("preparing")
    
    try {
      const analysisResult = await analyzeCurrency(input, setAnalysisState)
      setResult(analysisResult)
    } catch (error) {
      console.error(error)
      setAnalysisState("error")
    }
  }

  const handleRemoveImage = () => {
    handleInputChange({ imageFile: null, imagePreviewUrl: null })
  }

  const handleReset = () => {
    setAnalysisState("idle")
    setResult(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-shield-navy selection:bg-shield-cyan/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 flex justify-center bg-shield-navy">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <Navigation />

      <main className="relative flex-1 pt-24 pb-12 lg:pt-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          
          {/* Header & Status Badges */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-shield-cyan/10 pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Counterfeit Currency Detection & Verification</h1>
              <p className="mt-1 max-w-2xl text-sm text-shield-muted">
                AI-assisted preliminary screening of currency security features using computer vision and explainable intelligence.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <ShieldCheck className="h-3 w-3" /> Secure Image Processing
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Cpu className="h-3 w-3" /> Vision Engine Ready
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Eye className="h-3 w-3" /> Prototype Screening
              </div>
            </div>
          </div>

          {/* 3-Zone Workspace */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(340px,1.05fr)_minmax(380px,1.1fr)_minmax(340px,1fr)] lg:gap-6 lg:items-start">
            
            {/* Left Zone: Input */}
            <div>
              <CurrencyInputPanel 
                input={input}
                onInputChange={handleInputChange}
                onAnalyze={handleAnalyze}
                isAnalyzing={analysisState !== "idle" && analysisState !== "complete" && analysisState !== "error"}
              />
            </div>

            {/* Center Zone: Inspection */}
            <div className="order-first md:order-none md:col-span-2 lg:col-span-1">
              <CurrencyPreviewPanel 
                state={analysisState}
                result={result}
                imageUrl={input.imagePreviewUrl}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            {/* Right Zone: Intelligence */}
            <div>
              <CurrencyIntelligencePanel 
                verdict={result}
                onReset={handleReset}
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
