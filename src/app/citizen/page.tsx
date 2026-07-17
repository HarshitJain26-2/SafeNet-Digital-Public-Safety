"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ThreatInputWorkspace } from "@/components/citizen/threat-input-workspace"
import { AnalysisWorkspace } from "@/components/citizen/analysis-workspace"
import { IntelligenceWorkspace } from "@/components/citizen/intelligence-workspace"
import { ComplaintDraftModal } from "@/components/citizen/complaint-draft-modal"
import { ThreatInput, AnalysisState, ThreatVerdict } from "@/lib/types/citizen"
import { analyzeThreat } from "@/lib/services/analysis"
import { Globe } from "lucide-react"

export default function CitizenPage() {
  const [input, setInput] = useState<ThreatInput>({
    source: "WhatsApp",
    text: "",
    file: null,
  })
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [verdict, setVerdict] = useState<ThreatVerdict | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const handleInputChange = (updates: Partial<ThreatInput>) => {
    setInput(prev => ({ ...prev, ...updates }))
    // Reset analysis if input changes
    if (analysisState !== "idle") {
      setAnalysisState("idle")
      setVerdict(null)
    }
  }

  const handleAnalyze = async () => {
    setVerdict(null)
    setAnalysisState("validating")
    
    try {
      const result = await analyzeThreat(input, setAnalysisState)
      setVerdict(result)
    } catch (error) {
      console.error(error)
      setAnalysisState("error")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-shield-navy selection:bg-shield-cyan/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 flex justify-center bg-shield-navy">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <Navigation />

      <main className="relative flex-1 pt-24 pb-8 lg:pt-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          
          {/* Header & Language Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-shield-cyan/10 pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Citizen Fraud Shield</h1>
              <p className="text-sm text-shield-muted">Secure, explainable threat analysis for public safety.</p>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg border border-shield-cyan/20 bg-shield-navy-light/50 p-1">
              <Globe className="ml-2 h-4 w-4 text-shield-muted" />
              <button 
                onClick={() => setLanguage("en")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${language === "en" ? "bg-shield-cyan/20 text-shield-cyan" : "text-shield-muted hover:text-white"}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage("hi")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${language === "hi" ? "bg-shield-cyan/20 text-shield-cyan" : "text-shield-muted hover:text-white"}`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* 3-Zone Workspace */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(340px,1.05fr)_minmax(380px,1.1fr)_minmax(340px,1fr)] lg:gap-6 lg:items-start">
            {/* Left Zone: Input */}
            <div>
              <ThreatInputWorkspace 
                input={input}
                onInputChange={handleInputChange}
                onAnalyze={handleAnalyze}
                isAnalyzing={analysisState !== "idle" && analysisState !== "complete" && analysisState !== "error"}
              />
            </div>

            {/* Center Zone: Analysis */}
            <div className="order-first md:order-none md:col-span-2 lg:col-span-1">
              <AnalysisWorkspace 
                state={analysisState}
                verdict={verdict}
              />
            </div>

            {/* Right Zone: Intelligence */}
            <div>
              <IntelligenceWorkspace 
                verdict={verdict}
                onGenerateDraft={() => setIsModalOpen(true)}
              />
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <ComplaintDraftModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        verdict={verdict}
        input={input}
      />
    </div>
  )
}
