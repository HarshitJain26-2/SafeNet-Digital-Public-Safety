"use client"

import { useRef, useState, DragEvent, ChangeEvent } from "react"
import { CurrencyInput, CurrencyDenomination, CurrencyNoteSide, CaptureType } from "@/lib/types/currency"
import { Button } from "@/components/ui/button"
import { UploadCloud, Camera, ScanLine, FileWarning } from "lucide-react"

interface Props {
  input: CurrencyInput
  onInputChange: (updates: Partial<CurrencyInput>) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

const DENOMINATIONS: CurrencyDenomination[] = ["₹100", "₹200", "₹500", "₹2000"]
const NOTE_SIDES: CurrencyNoteSide[] = ["Front", "Reverse"]
const CAPTURE_TYPES: CaptureType[] = ["Single Image", "Front + Reverse"]

export function CurrencyInputPanel({ input, onInputChange, onAnalyze, isAnalyzing }: Props) {
  const [inputMode, setInputMode] = useState<"upload" | "camera">("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateAndSetFile = (file: File) => {
    setError(null)
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please use JPG, PNG, or WebP.")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError("File is too large. Maximum size is 10MB.")
      return
    }

    const imageUrl = URL.createObjectURL(file)
    onInputChange({ imageFile: file, imagePreviewUrl: imageUrl })
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const isValidInput = input.imageFile !== null

  return (
    <div className="flex flex-col h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
      
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Submit Currency for Analysis</h2>
        <p className="mt-1.5 text-sm text-shield-muted">
          Capture or upload a clear image of a currency note for AI-assisted security-feature screening.
        </p>
      </div>

      <div className="space-y-5">
        {/* Section 1: Input Method */}
        <div>
          <div className="flex rounded-lg bg-shield-navy/50 p-1 ring-1 ring-shield-cyan/10">
            <button
              onClick={() => setInputMode("upload")}
              className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                inputMode === "upload" 
                  ? "bg-shield-cyan/20 text-shield-cyan shadow-sm" 
                  : "text-shield-muted hover:text-white"
              }`}
            >
              <UploadCloud className="h-4 w-4" /> Upload Image
            </button>
            <button
              onClick={() => setInputMode("camera")}
              className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                inputMode === "camera" 
                  ? "bg-shield-cyan/20 text-shield-cyan shadow-sm" 
                  : "text-shield-muted hover:text-white"
              }`}
            >
              <Camera className="h-4 w-4" /> Use Camera
            </button>
          </div>
        </div>

        {/* Section 2: Currency Details */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
              Currency
            </label>
            <div className="w-full rounded-md border border-shield-cyan/10 bg-shield-navy-light/30 px-3 py-2 text-sm text-white">
              Indian Rupee (INR)
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
              Denomination
            </label>
            <div className="flex flex-wrap gap-2">
              {DENOMINATIONS.map((den) => (
                <button
                  key={den}
                  onClick={() => onInputChange({ denomination: den })}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    input.denomination === den
                      ? "border-shield-cyan bg-shield-cyan/10 text-shield-cyan"
                      : "border-shield-cyan/10 bg-shield-navy/40 text-shield-muted hover:border-shield-cyan/30 hover:bg-shield-navy/60 hover:text-white"
                  }`}
                >
                  {den}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
                Note Side
              </label>
              <select 
                value={input.noteSide}
                onChange={(e) => onInputChange({ noteSide: e.target.value as CurrencyNoteSide })}
                className="w-full appearance-none rounded border border-shield-cyan/20 bg-shield-navy-light/30 p-2 text-xs text-white focus:border-shield-cyan focus:outline-none focus:ring-1 focus:ring-shield-cyan"
              >
                {NOTE_SIDES.map(side => (
                  <option key={side} value={side} className="bg-shield-navy">{side}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-shield-muted/70">
                Capture Type
              </label>
              <select 
                value={input.captureType}
                onChange={(e) => onInputChange({ captureType: e.target.value as CaptureType })}
                className="w-full appearance-none rounded border border-shield-cyan/20 bg-shield-navy-light/30 p-2 text-xs text-white focus:border-shield-cyan focus:outline-none focus:ring-1 focus:ring-shield-cyan"
              >
                {CAPTURE_TYPES.map(type => (
                  <option key={type} value={type} className="bg-shield-navy">{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Upload Area */}
        <div>
          {inputMode === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-shield-cyan bg-shield-cyan/5"
                  : "border-shield-cyan/20 bg-shield-navy/30 hover:border-shield-cyan/40 hover:bg-shield-navy/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              <UploadCloud className={`mb-3 h-8 w-8 ${isDragging ? "text-shield-cyan" : "text-shield-muted/50"}`} />
              <p className="text-sm font-medium text-white">Upload Currency Image</p>
              <p className="mt-1 text-xs text-shield-muted">Drag and drop a clear JPG, PNG, or WebP image here</p>
              
              <div className="mt-4 rounded bg-shield-cyan/10 px-3 py-1.5 text-xs font-medium text-shield-cyan">
                Browse Image
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-shield-cyan/20 bg-shield-navy/30 p-6 text-center">
              <Camera className="mb-3 h-8 w-8 text-shield-muted/50" />
              <p className="text-sm font-medium text-white">Camera Interface Ready</p>
              <p className="mt-1 text-xs text-shield-muted max-w-[200px]">
                Ensure your browser has camera permissions to use this feature.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 border-shield-cyan/20 text-shield-cyan hover:bg-shield-cyan/10"
                onClick={() => alert("Camera API integration ready for backend.")}
              >
                Request Camera Access
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
              <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p>{error}</p>
            </div>
          )}
          
          {input.imageFile && !error && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-shield-cyan/20 bg-shield-cyan/5 p-3 text-xs">
              <div className="flex items-center gap-2 truncate text-shield-cyan">
                <UploadCloud className="h-4 w-4 shrink-0" />
                <span className="truncate">{input.imageFile.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onInputChange({ imageFile: null, imagePreviewUrl: null })
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="ml-2 text-shield-muted hover:text-white"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Capture Guidance */}
        <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy-light/30 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase text-shield-muted">Capture Guidance</h4>
          <ul className="space-y-1.5 text-xs text-shield-muted/80">
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-shield-cyan/50" /> Place the complete note inside the frame</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-shield-cyan/50" /> Use bright, even lighting</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-shield-cyan/50" /> Avoid glare and heavy shadows</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-shield-cyan/50" /> Keep the image sharp and readable</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-shield-cyan/50" /> Capture both sides when possible</li>
          </ul>
        </div>
      </div>

      {/* Section 5: Primary Action */}
      <div className="mt-5 border-t border-shield-cyan/10 pt-4">
        <Button
          onClick={onAnalyze}
          disabled={!isValidInput || isAnalyzing}
          className="w-full bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90 disabled:cursor-not-allowed disabled:bg-shield-navy-light disabled:text-shield-muted"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-shield-navy/20 border-t-shield-navy" />
              Initializing Vision Engine...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ScanLine className="h-4 w-4" /> Analyze Currency Note
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
