"use client"

import { CrimeHotspot, RegionalIntelligenceBrief } from "@/lib/types/geospatial"
import { X, Printer, Download, FileText, AlertCircle, ShieldAlert } from "lucide-react"
import { ShieldAILogo } from "@/components/shield-logo"
import { Button } from "@/components/ui/button"

interface Props {
  brief: RegionalIntelligenceBrief | null
  onClose: () => void
}

export function RegionalBriefDialog({ brief, onClose }: Props) {
  if (!brief) return null

  const { hotspot, generatedAt } = brief
  const isCritical = hotspot.riskLevel === "Critical" || hotspot.riskLevel === "High"

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert("Downloading Regional Intelligence Brief PDF...")
  }

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-shield-navy/90 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
      
      {/* Modal Container */}
      <div 
        className="relative flex w-full max-w-3xl flex-col max-h-[90vh] rounded-xl border border-shield-cyan/20 bg-shield-navy shadow-2xl shadow-shield-cyan/10 overflow-hidden"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-shield-cyan/20 bg-shield-navy-light/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <ShieldAILogo />
            <span className="text-lg font-bold text-white border-l border-shield-cyan/20 pl-3">Intelligence Brief</span>
          </div>
          <button 
            onClick={onClose}
            className="rounded p-1 text-shield-muted transition-colors hover:bg-shield-cyan/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content (Printable area) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white sm:p-8" id="printable-brief">
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * { visibility: hidden; }
              #printable-brief, #printable-brief * { visibility: visible; }
              #printable-brief { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white; color: black !important; }
              .print-dark-text { color: #0f172a !important; }
              .print-gray-text { color: #475569 !important; }
              .print-border { border-color: #cbd5e1 !important; }
            }
          `}} />

          {/* Document Header */}
          <div className="mb-6 flex justify-between items-start border-b pb-4 print-border border-gray-200">
            <div>
              <h1 className="text-2xl font-black print-dark-text text-[#0f172a] uppercase tracking-tight">Geospatial Intelligence Report</h1>
              <p className="text-sm font-semibold print-gray-text text-[#475569] mt-1">Region: {hotspot.regionName}, {hotspot.stateName}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Generated At</div>
              <div className="text-xs print-dark-text text-[#0f172a] font-mono">{generatedAt}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 mt-2">Clearance</div>
              <div className="text-xs print-dark-text font-bold text-red-600">RESTRICTED</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print-border">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Regional Risk Level</p>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${isCritical ? "text-red-600" : "text-amber-600"}`}>
                  {hotspot.riskLevel}
                </span>
                <span className="text-sm font-semibold print-gray-text text-gray-600">Score: {hotspot.riskScore}/100</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print-border">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Primary Threat Vector</p>
              <div className="text-lg font-bold print-dark-text text-[#0f172a]">
                {hotspot.primaryThreat}
              </div>
              <p className="text-xs font-semibold print-gray-text text-gray-600 mt-0.5">
                Trend: {hotspot.trend}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase print-dark-text text-[#0f172a] border-b border-gray-200 print-border pb-2 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Threat Distribution Summary
            </h3>
            <div className="space-y-3">
              {hotspot.threatDistribution.map((threat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="w-1/2 text-sm font-medium print-dark-text text-[#0f172a]">{threat.category}</div>
                  <div className="w-1/4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${isCritical ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${threat.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-1/4 text-right text-sm print-gray-text text-gray-600">{threat.count} incidents ({threat.percentage}%)</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="text-sm font-bold uppercase text-red-800 mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> AI Deployment Recommendation
            </h3>
            <p className="text-sm text-red-900 leading-relaxed font-medium mb-4">
              {hotspot.recommendation.summary}
            </p>
            <div className="bg-white p-4 rounded border border-red-100">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Recommended Actions Checklist:</p>
              <ul className="space-y-2">
                {hotspot.recommendation.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-800 font-medium">
                    <div className="mt-0.5 h-3 w-3 rounded-sm border-2 border-gray-300 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12 pt-4 border-t border-gray-200 print-border">
            <AlertCircle className="h-4 w-4 text-gray-400 mx-auto mb-2" />
            <p className="text-[10px] font-medium text-gray-500">
              PROTOTYPE DEMONSTRATION DATA • FOR PRELIMINARY DECISION SUPPORT ONLY
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-shield-cyan/20 bg-shield-navy-light/80 p-4">
          <Button variant="outline" onClick={onClose} className="border-shield-cyan/20 text-shield-muted hover:text-white hover:bg-shield-cyan/10">
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint} className="border-shield-cyan/20 text-shield-cyan hover:bg-shield-cyan/10">
            <Printer className="mr-2 h-4 w-4" /> Print Brief
          </Button>
          <Button onClick={handleDownload} className="bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

      </div>
    </div>
  )
}
