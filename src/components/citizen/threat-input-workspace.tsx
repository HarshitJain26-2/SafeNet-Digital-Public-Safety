"use client"

import { useState, useRef } from "react"
import { ThreatInput, InputSource } from "@/lib/types/citizen"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Mic, 
  Banknote, 
  MoreHorizontal,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from "lucide-react"

interface Props {
  input: ThreatInput
  onInputChange: (updates: Partial<ThreatInput>) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

const SOURCES: { id: InputSource; icon: React.ElementType; label: string }[] = [
  { id: "WhatsApp", icon: MessageSquare, label: "WhatsApp" },
  { id: "SMS", icon: Smartphone, label: "SMS" },
  { id: "Email", icon: Mail, label: "Email" },
  { id: "Voice", icon: Mic, label: "Call/Voice" },
  { id: "Payment Request", icon: Banknote, label: "Payment" },
  { id: "Other", icon: MoreHorizontal, label: "Other" },
]

export function ThreatInputWorkspace({ input, onInputChange, onAnalyze, isAnalyzing }: Props) {
  const [showAdditional, setShowAdditional] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be under 5MB")
        return
      }
      onInputChange({ file })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
      onInputChange({ file })
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsRecording(false)
      return
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setRecordingError("Speech recognition is not supported in your browser.")
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        let transcript = ""
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        onInputChange({ text: transcript })
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onerror = (event: any) => {
        setRecordingError(`Error: ${event.error}`)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.start()
      setIsRecording(true)
      setRecordingError(null)
    } catch (_err) {
      setRecordingError("Microphone permission denied or unavailable.")
    }
  }

  const isValidInput = input.text.trim().length > 0 || input.file !== null

  return (
    <div className="flex flex-col h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Analyze a Suspicious Communication</h2>
        <p className="mt-2 text-sm text-shield-muted">
          Submit a suspicious message, voice transcript, screenshot, or payment request for explainable AI-assisted risk analysis.
        </p>
      </div>

      <div className="space-y-6">
        {/* Source Selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
            Source
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {SOURCES.map((src) => (
              <button
                key={src.id}
                onClick={() => onInputChange({ source: src.id })}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2 transition-colors ${
                  input.source === src.id
                    ? "border-shield-cyan bg-shield-cyan/10 text-shield-cyan"
                    : "border-shield-cyan/10 bg-shield-navy/40 text-shield-muted hover:border-shield-cyan/30 hover:bg-shield-navy/60"
                }`}
              >
                <src.icon className="h-4 w-4" />
                <span className="text-[10px] font-medium">{src.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
              Communication Text
            </label>
            {input.text.length > 0 && (
              <button
                onClick={() => onInputChange({ text: "" })}
                className="text-[10px] text-shield-muted hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input.text}
            onChange={(e) => onInputChange({ text: e.target.value })}
            placeholder="Paste a suspicious WhatsApp message, SMS, email, payment request, or digital-arrest warning here..."
            className="h-32 w-full resize-none rounded-lg border border-shield-cyan/10 bg-shield-navy/40 p-3 text-sm text-white placeholder-shield-muted/40 transition-colors focus:border-shield-cyan/40 focus:outline-none focus:ring-1 focus:ring-shield-cyan/40"
          />
          <div className="mt-1.5 text-right text-[10px] text-shield-muted/50">
            {input.text.length} characters
          </div>
        </div>

        {/* Action Row: Voice & Image */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Voice Input */}
          <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/20 p-3">
            <button
              onClick={toggleRecording}
              className={`flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                isRecording
                  ? "bg-shield-critical/20 text-shield-critical hover:bg-shield-critical/30"
                  : "bg-shield-navy-light text-shield-muted hover:bg-shield-navy hover:text-white"
              }`}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
              {isRecording ? "Listening..." : "Speak Message"}
            </button>
            {recordingError && <p className="mt-2 text-[10px] text-shield-critical">{recordingError}</p>}
          </div>

          {/* Screenshot Upload */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative rounded-lg border border-dashed transition-colors ${
              input.file ? "border-shield-cyan/40 bg-shield-cyan/5" : "border-shield-cyan/20 bg-shield-navy/20 hover:border-shield-cyan/40"
            }`}
          >
            {input.file ? (
              <div className="flex h-full items-center justify-between p-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon className="h-4 w-4 shrink-0 text-shield-cyan" />
                  <span className="truncate text-xs text-white">{input.file.name}</span>
                </div>
                <button onClick={() => onInputChange({ file: null })} className="p-1 text-shield-muted hover:text-shield-critical">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-3 text-center">
                <Upload className="mb-1 h-4 w-4 text-shield-muted/60" />
                <span className="text-[10px] text-shield-muted">Drag screenshot or <button onClick={() => fileInputRef.current?.click()} className="text-shield-cyan hover:underline">browse</button></span>
                <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
              </div>
            )}
          </div>
        </div>

        {/* Additional Intelligence */}
        <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/30">
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="flex w-full items-center justify-between p-3 text-sm font-medium text-shield-muted hover:text-white"
          >
            Additional Intelligence (Optional)
            {showAdditional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showAdditional && (
            <div className="space-y-3 border-t border-shield-cyan/10 p-3 pt-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase text-shield-muted/70">Phone Number</label>
                <input
                  type="text"
                  value={input.phoneNumber || ""}
                  onChange={(e) => onInputChange({ phoneNumber: e.target.value })}
                  placeholder="+91..."
                  className="w-full rounded-md border border-shield-cyan/10 bg-shield-navy/50 p-2 text-xs text-white focus:border-shield-cyan/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-shield-muted/70">UPI ID</label>
                <input
                  type="text"
                  value={input.upiId || ""}
                  onChange={(e) => onInputChange({ upiId: e.target.value })}
                  placeholder="username@bank"
                  className="w-full rounded-md border border-shield-cyan/10 bg-shield-navy/50 p-2 text-xs text-white focus:border-shield-cyan/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-shield-muted/70">Suspicious URL</label>
                <input
                  type="text"
                  value={input.url || ""}
                  onChange={(e) => onInputChange({ url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-md border border-shield-cyan/10 bg-shield-navy/50 p-2 text-xs text-white focus:border-shield-cyan/40 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-shield-cyan/10">
        <Button
          onClick={onAnalyze}
          disabled={!isValidInput || isAnalyzing}
          className="w-full bg-shield-cyan py-6 text-base font-semibold text-shield-navy hover:bg-shield-cyan/90 disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing Intelligence..." : "Analyze Threat"}
        </Button>
      </div>
    </div>
  )
}
