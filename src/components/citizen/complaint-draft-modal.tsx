"use client"

import { useState, useEffect } from "react"
import { ThreatVerdict, ThreatInput } from "@/lib/types/citizen"
import { Button } from "@/components/ui/button"
import { X, Copy, Printer, AlertTriangle, ShieldCheck } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  verdict: ThreatVerdict | null
  input: ThreatInput
}

export function ComplaintDraftModal({ isOpen, onClose, verdict, input }: Props) {
  const [description, setDescription] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && verdict) {
      setIsGenerating(true)
      setDescription("Generating official complaint draft via AI...")
      fetch("http://localhost:8000/api/v1/fraud/generate-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            source: input.source,
            text: input.text,
            phoneNumber: input.phoneNumber || null,
            upiId: input.upiId || null,
            url: input.url || null
          },
          verdict: {
            id: verdict.id || `cfs_txt_${Math.random().toString(36).substr(2, 9)}`,
            level: verdict.level,
            score: verdict.score,
            confidence: verdict.confidence,
            category: verdict.category,
            assessment: verdict.assessment,
            evidence: verdict.evidence.map(e => ({
              label: e.label,
              severity: e.severity,
              explanation: e.explanation
            })),
            entities: verdict.entities.map(e => ({
              type: e.type,
              value: e.value,
              copyable: e.copyable
            })),
            recommendations: verdict.recommendations,
            timestamp: verdict.timestamp || new Date().toISOString()
          }
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.suggested_complaint) {
          setDescription(res.data.suggested_complaint)
        } else {
          // Fallback to local template
          setDescription(`I am reporting a suspicious communication I received via ${input.source}. The message was: "${input.text}". 

Based on an initial analysis by ShieldAI, this communication exhibits characteristics of a ${verdict.category}. The sender attempted to create a false sense of urgency.

I am submitting this report for further investigation.`)
        }
      })
      .catch(() => {
        // Fallback to local template
        setDescription(`I am reporting a suspicious communication I received via ${input.source}. The message was: "${input.text}". 

Based on an initial analysis by ShieldAI, this communication exhibits characteristics of a ${verdict.category}. The sender attempted to create a false sense of urgency.

I am submitting this report for further investigation.`)
      })
      .finally(() => {
        setIsGenerating(false)
      })
    }
  }, [isOpen, verdict, input])

  if (!isOpen || !verdict) return null

  const handleCopy = () => {
    const textToCopy = `Incident Report Draft
Date: ${new Date().toLocaleDateString()}
Category: ${verdict.category}
Source: ${input.source}

Description:
${description}

Entities Involved:
${verdict.entities.map(e => `- ${e.type}: ${e.value}`).join("\n")}
`
    navigator.clipboard.writeText(textToCopy)
    alert("Draft copied to clipboard!")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-shield-navy/80 backdrop-blur-sm print:bg-white print:p-0">
      
      {/* Print-only CSS injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-complaint, #printable-complaint * {
            visibility: visible;
            color: black !important;
            background: white !important;
            border-color: #ccc !important;
          }
          #printable-complaint {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            overflow: visible;
            padding: 2cm;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      <div 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-shield-cyan/20 bg-shield-navy shadow-2xl print:border-none print:shadow-none"
      >
        <div className="flex items-center justify-between border-b border-shield-cyan/10 bg-shield-navy-light/50 p-4 sm:px-6 print-hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-shield-cyan" />
            <h2 id="modal-title" className="text-lg font-semibold text-white">AI-Generated Complaint Draft</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-shield-muted transition-colors hover:bg-shield-cyan/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6" id="printable-complaint">
          
          <div className="mb-6 rounded-lg border border-shield-warning/30 bg-shield-warning/10 p-4 print-hidden">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-shield-warning" />
              <div>
                <h4 className="text-sm font-semibold text-shield-warning">Review before submitting</h4>
                <p className="mt-1 text-xs text-shield-muted">Review and edit this draft before submitting it through the appropriate official reporting channel (e.g., cybercrime.gov.in). ShieldAI does not automatically file this report.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Incident Category</label>
                <div className="rounded border border-shield-cyan/10 bg-shield-navy-light/30 p-2.5 text-sm text-white print:border-gray-300 print:text-black">
                  {verdict.category}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Incident Date</label>
                <div className="rounded border border-shield-cyan/10 bg-shield-navy-light/30 p-2.5 text-sm text-white print:border-gray-300 print:text-black">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Communication Source</label>
                <div className="rounded border border-shield-cyan/10 bg-shield-navy-light/30 p-2.5 text-sm text-white print:border-gray-300 print:text-black">
                  {input.source}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Threat Score</label>
                <div className="rounded border border-shield-cyan/10 bg-shield-navy-light/30 p-2.5 text-sm text-white print:border-gray-300 print:text-black">
                  {verdict.score}/100 ({verdict.level})
                </div>
              </div>
            </div>

            {verdict.entities.length > 0 && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Suspicious Entities</label>
                <div className="rounded border border-shield-cyan/10 bg-shield-navy-light/30 p-3 print:border-gray-300">
                  <ul className="space-y-1">
                    {verdict.entities.map((e, idx) => (
                      <li key={idx} className="text-sm text-white print:text-black">
                        <span className="text-shield-muted print:text-gray-600">{e.type}:</span> {e.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-shield-muted">Incident Description (Editable)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isGenerating}
                className="min-h-[160px] w-full rounded border border-shield-cyan/20 bg-shield-navy-light/30 p-3 text-sm text-white focus:border-shield-cyan focus:outline-none focus:ring-1 focus:ring-shield-cyan print:border-gray-300 print:text-black print:resize-none disabled:opacity-50"
              />
            </div>
          </div>

        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-shield-cyan/10 bg-shield-navy-light/50 p-4 sm:flex-row sm:px-6 print-hidden">
          <Button variant="outline" onClick={onClose} className="border-shield-cyan/20 text-white hover:bg-shield-navy-light">
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint} className="border-shield-cyan/20 text-white hover:bg-shield-navy-light">
            <Printer className="mr-2 h-4 w-4" /> Save PDF / Print
          </Button>
          <Button onClick={handleCopy} className="bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90">
            <Copy className="mr-2 h-4 w-4" /> Copy Draft
          </Button>
        </div>
      </div>
    </div>
  )
}
