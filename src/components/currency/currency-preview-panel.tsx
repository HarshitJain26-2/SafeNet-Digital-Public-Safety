"use client"

import { CurrencyAnalysisState, CurrencyAnalysisResult } from "@/lib/types/currency"
import { ScanLine, Search, ZoomIn, ZoomOut, RefreshCw, X } from "lucide-react"

interface Props {
  state: CurrencyAnalysisState
  result: CurrencyAnalysisResult | null
  imageUrl: string | null
  onRemoveImage: () => void
}

export function CurrencyPreviewPanel({ state, result, imageUrl, onRemoveImage }: Props) {
  const isIdle = state === "idle" || state === "error"
  const isAnalyzing = state !== "idle" && state !== "complete" && state !== "error"
  const isComplete = state === "complete" && result !== null

  return (
    <div className="flex flex-col min-h-[400px] lg:min-h-[500px] h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 p-5 shadow-2xl shadow-shield-cyan/5 backdrop-blur-sm sm:p-6">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-shield-cyan/10 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Visual Security Inspection</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isAnalyzing ? "bg-shield-cyan" : "bg-shield-cyan/30"
              }`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                isAnalyzing ? "bg-shield-cyan" : isComplete ? "bg-green-400" : "bg-shield-cyan/50"
              }`} />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-shield-cyan">
              {isAnalyzing ? "Analysis In Progress" : isComplete ? "Inspection Complete" : "Awaiting Currency Image"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1">
        {/* Empty State */}
        {!imageUrl && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8 flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-shield-cyan/20 bg-shield-cyan/5">
              <ScanLine className="h-10 w-10 text-shield-cyan/40" />
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-full w-full animate-pulse bg-gradient-to-b from-transparent via-shield-cyan/10 to-transparent" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Upload or capture a currency-note image to begin visual security inspection.</h3>
            <p className="mt-3 max-w-[340px] text-sm text-shield-muted">
              Security-feature overlays and explainable observations will appear here.
            </p>
          </div>
        )}

        {/* Image Preview & Analysis State */}
        {imageUrl && (
          <div className="relative flex flex-col items-center w-full max-w-full mx-auto">
            
            {/* Image Container */}
            <div className="relative w-full overflow-hidden rounded-lg border border-shield-cyan/20 bg-black/40" style={{ minHeight: "300px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageUrl} 
                alt="Currency Preview" 
                className="w-full object-contain max-h-[500px]"
              />

              {/* Scanning Animation */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute left-0 top-0 h-[2px] w-full bg-shield-cyan shadow-[0_0_15px_3px_rgba(0,212,255,0.7)] animate-[scan_2s_ease-in-out_infinite_alternate]" />
                  <div className="absolute inset-0 bg-shield-cyan/5 animate-pulse" />
                </div>
              )}

              {/* Overlays */}
              {isComplete && result && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Fake fixed overlays mapped over the image to simulate detections */}
                  {result.features.map((feature, idx) => {
                    const top = 20 + (idx * 25);
                    const left = 10 + (idx * 30);
                    
                    let borderColor = "border-green-400";
                    let bgColor = "bg-green-400/20";
                    let textColor = "text-green-400";
                    
                    if (feature.status === "Review") {
                      borderColor = "border-amber-400";
                      bgColor = "bg-amber-400/20";
                      textColor = "text-amber-400";
                    } else if (feature.status === "Inconsistency") {
                      borderColor = "border-red-400";
                      bgColor = "bg-red-400/20";
                      textColor = "text-red-400";
                    }

                    return (
                      <div 
                        key={feature.id}
                        className={`absolute border-2 ${borderColor} ${bgColor} rounded-sm flex items-center justify-center backdrop-blur-[1px]`}
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          width: '120px',
                          height: '60px',
                        }}
                      >
                        <span className={`absolute -top-6 left-0 whitespace-nowrap rounded bg-shield-navy/90 px-2 py-0.5 text-[10px] font-bold ${textColor} ring-1 ring-inset ring-current`}>
                          {feature.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Analysis Progress Steps */}
            {isAnalyzing && (
              <div className="mt-6 w-full max-w-sm rounded-lg border border-shield-cyan/20 bg-shield-navy-light/50 p-4">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 animate-pulse text-shield-cyan" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {state === "preparing" && "Preparing image..."}
                      {state === "detecting" && "Detecting currency-note regions..."}
                      {state === "inspecting" && "Inspecting visible security features..."}
                      {state === "generating" && "Generating explainable assessment..."}
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-shield-cyan/10">
                      <div className="h-full bg-shield-cyan transition-all duration-500 ease-out" 
                        style={{
                          width: state === "preparing" ? "25%" :
                                 state === "detecting" ? "50%" :
                                 state === "inspecting" ? "75%" : "95%"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post-Analysis Legend & Controls */}
            {isIdle && !isComplete && (
              <div className="mt-4 flex w-full justify-end gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-shield-cyan/10 bg-shield-navy-light/50 px-3 py-1.5 text-xs text-shield-muted transition-colors hover:text-white">
                  <ZoomIn className="h-3.5 w-3.5" /> Zoom In
                </button>
                <button className="flex items-center gap-1.5 rounded-md border border-shield-cyan/10 bg-shield-navy-light/50 px-3 py-1.5 text-xs text-shield-muted transition-colors hover:text-white">
                  <ZoomOut className="h-3.5 w-3.5" /> Zoom Out
                </button>
                <button className="flex items-center gap-1.5 rounded-md border border-shield-cyan/10 bg-shield-navy-light/50 px-3 py-1.5 text-xs text-shield-muted transition-colors hover:text-white">
                  <RefreshCw className="h-3.5 w-3.5" /> Reset View
                </button>
                <button 
                  onClick={onRemoveImage}
                  className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            )}

            {isComplete && (
              <div className="mt-4 flex w-full items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-shield-muted">
                    <span className="h-2 w-2 rounded-sm bg-green-400/80" /> Consistent
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-shield-muted">
                    <span className="h-2 w-2 rounded-sm bg-amber-400/80" /> Review Recommended
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-shield-muted">
                    <span className="h-2 w-2 rounded-sm bg-red-400/80" /> Inconsistency
                  </div>
                </div>
                <button 
                  onClick={onRemoveImage}
                  className="flex items-center gap-1.5 text-xs font-medium text-shield-cyan hover:text-shield-cyan/80"
                >
                  Upload New Image
                </button>
              </div>
            )}

          </div>
        )}

      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(500px); }
        }
      `}</style>
    </div>
  )
}
