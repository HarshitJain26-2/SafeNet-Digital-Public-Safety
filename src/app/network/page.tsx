"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DatasetInputPanel } from "@/components/network/dataset-input-panel"
import { NetworkGraphWorkspace } from "@/components/network/network-graph-workspace"
import { EntityIntelligencePanel } from "@/components/network/entity-intelligence-panel"
import { InvestigationDetails } from "@/components/network/investigation-details"
import { InvestigationDataset, NetworkAnalysisState } from "@/lib/types/network"
import { analyzeNetworkDataset } from "@/lib/services/network"
import { ShieldCheck, Network, Eye } from "lucide-react"

export default function NetworkPage() {
  const [csvContent, setCsvContent] = useState<string>("")
  const [analysisState, setAnalysisState] = useState<NetworkAnalysisState>("idle")
  const [dataset, setDataset] = useState<InvestigationDataset | null>(null)
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)

  const handleDatasetLoaded = (content: string) => {
    setCsvContent(content)
    if (content === "") {
      // Reset state if file is removed
      setAnalysisState("idle")
      setDataset(null)
      setSelectedEntityId(null)
    }
  }

  const handleGenerateNetwork = async () => {
    if (!csvContent) return
    
    setDataset(null)
    setSelectedEntityId(null)
    setAnalysisState("validating")
    
    try {
      const result = await analyzeNetworkDataset(csvContent, setAnalysisState)
      setDataset(result)
    } catch (error) {
      console.error(error)
      setAnalysisState("error")
    }
  }

  const handleFocusEntity = (id: string | null) => {
    setSelectedEntityId(id)
    // In a real application, you might also trigger a pan/zoom to the node coordinates here
  }

  return (
    <div className="flex min-h-screen flex-col bg-shield-navy selection:bg-shield-cyan/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 flex justify-center bg-shield-navy">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <Navigation />

      <main className="relative flex-1 pt-24 pb-12 lg:pt-24">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header & Status Badges */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-shield-cyan/10 pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Fraud Network Analysis & Investigation</h1>
              <p className="mt-1 max-w-3xl text-sm text-shield-muted">
                Transform transaction and call-record data into explainable network intelligence for faster investigation and risk prioritization.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Network className="h-3 w-3" /> Graph Engine Ready
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <ShieldCheck className="h-3 w-3" /> Secure Dataset Processing
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-cyan/10 px-2 py-1 text-[10px] font-medium text-shield-cyan">
                <Eye className="h-3 w-3" /> Prototype Intelligence
              </div>
            </div>
          </div>

          {/* Top Main Workspace Grid */}
          <div className="grid gap-5 md:grid-cols-[1fr_1fr] lg:grid-cols-[320px_1fr_320px] xl:grid-cols-[380px_1.5fr_380px] lg:gap-6 lg:items-start">
            
            {/* Left Zone: Dataset Input (Approx 24%) */}
            <div className="order-2 lg:order-1">
              <DatasetInputPanel 
                hasDataset={csvContent.length > 0}
                onDatasetLoaded={handleDatasetLoaded}
                onGenerateNetwork={handleGenerateNetwork}
                isAnalyzing={analysisState !== "idle" && analysisState !== "complete" && analysisState !== "error"}
              />
            </div>

            {/* Center Zone: Network Graph (Approx 50%) */}
            <div className="order-1 md:col-span-2 lg:col-span-1 lg:order-2">
              <NetworkGraphWorkspace 
                dataset={dataset}
                state={analysisState}
                selectedEntityId={selectedEntityId}
                onSelectEntity={handleFocusEntity}
              />
            </div>

            {/* Right Zone: Entity Intelligence (Approx 26%) */}
            <div className="order-3 md:col-span-2 lg:col-span-1 lg:order-3">
              <EntityIntelligencePanel 
                dataset={dataset}
                selectedEntityId={selectedEntityId}
              />
            </div>
          </div>

          {/* Bottom Details Section */}
          <InvestigationDetails 
            dataset={dataset} 
            onFocusEntity={handleFocusEntity}
          />

        </div>
      </main>

      <Footer />
    </div>
  )
}
