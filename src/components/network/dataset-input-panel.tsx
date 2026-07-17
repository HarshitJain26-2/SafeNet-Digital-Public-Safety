"use client"

import { useRef, useState, DragEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Database, 
  PhoneCall, 
  Network, 
  ChevronDown, 
  ChevronUp, 
  FileWarning, 
  CheckCircle2,
  Table as TableIcon
} from "lucide-react"

interface Props {
  onDatasetLoaded: (csvContent: string) => void
  onGenerateNetwork: () => void
  hasDataset: boolean
  isAnalyzing: boolean
}

type DatasetType = "Transaction Records" | "Call Records" | "Combined Intelligence"

export function DatasetInputPanel({ onDatasetLoaded, onGenerateNetwork, hasDataset, isAnalyzing }: Props) {
  const [datasetType, setDatasetType] = useState<DatasetType>("Transaction Records")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [showExpected, setShowExpected] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFile = (file: File) => {
    setError(null)
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Invalid file type. Please upload a .csv file.")
      return
    }
    
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      setError("File exceeds the 25MB limit.")
      return
    }

    setFileName(file.name)
    // Simulate loading the file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onDatasetLoaded(content)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const loadSampleDataset = () => {
    setError(null)
    setFileName("demo_synthetic_transactions.csv")
    onDatasetLoaded("DEMO_DATASET_LOADED")
  }

  return (
    <div className="flex flex-col h-fit rounded-xl border border-shield-cyan/15 bg-shield-navy-light/50 p-5 shadow-xl shadow-shield-cyan/5 sm:p-6">
      
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Investigation Dataset</h2>
        <p className="mt-1.5 text-sm text-shield-muted">
          Upload transaction records or call-detail data to generate an AI-assisted fraud-network investigation view.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* Section 1: Dataset Type */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { type: "Transaction Records", icon: Database },
              { type: "Call Records", icon: PhoneCall },
              { type: "Combined Intelligence", icon: Network }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setDatasetType(item.type as DatasetType)}
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-xs transition-colors ${
                  datasetType === item.type
                    ? "border-shield-cyan bg-shield-cyan/10 text-shield-cyan shadow-[0_0_10px_rgba(0,212,255,0.15)]"
                    : "border-shield-cyan/10 bg-shield-navy/40 text-shield-muted hover:border-shield-cyan/30 hover:bg-shield-navy/60 hover:text-white"
                }`}
              >
                <item.icon className="mb-2 h-4 w-4" />
                <span className="font-medium">{item.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: CSV Upload */}
        {!hasDataset ? (
          <div>
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
                accept=".csv,text/csv"
                onChange={handleFileChange}
              />
              <FileSpreadsheet className={`mb-3 h-8 w-8 ${isDragging ? "text-shield-cyan" : "text-shield-muted/50"}`} />
              <p className="text-sm font-medium text-white">Upload Investigation Dataset</p>
              <p className="mt-1 text-xs text-shield-muted">Drag and drop a CSV file containing transaction or call-record data.</p>
              
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded bg-shield-cyan/10 px-3 py-1.5 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/20">
                  Browse CSV
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 border-shield-cyan/20 text-xs text-shield-muted hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    loadSampleDataset()
                  }}
                >
                  Load Sample Dataset
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-shield-cyan/20 bg-shield-navy/30 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-2 text-green-400 ring-1 ring-green-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{fileName}</p>
                  <p className="text-xs text-shield-muted">Dataset parsed successfully</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFileName(null)
                  onDatasetLoaded("")
                }}
                className="text-xs font-medium text-shield-cyan hover:text-shield-cyan/80"
              >
                Change File
              </button>
            </div>
            
            {/* Section 4: Dataset Summary */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-shield-cyan/10 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-shield-muted">Total Records</p>
                <p className="text-sm font-medium text-white">1,420</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-shield-muted">Unique Entities</p>
                <p className="text-sm font-medium text-white">45</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-shield-muted">Date Range</p>
                <p className="text-sm font-medium text-white">May 12 - May 16</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-shield-muted">Missing Values</p>
                <p className="text-sm font-medium text-green-400">0%</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Expected Data Format */}
        <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy-light/30">
          <button 
            className="flex w-full items-center justify-between p-3 text-xs font-medium text-shield-muted hover:text-white"
            onClick={() => setShowExpected(!showExpected)}
          >
            Expected CSV Fields
            {showExpected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showExpected && (
            <div className="border-t border-shield-cyan/10 p-3 text-xs text-shield-muted/80">
              <p className="mb-2 font-medium text-shield-cyan/80">Transaction Example:</p>
              <code className="block rounded bg-shield-navy p-2 font-mono text-[10px] text-white/70">
                transaction_id, timestamp, source_account, destination_account, amount, location, transaction_type
              </code>
              <p className="mt-3 mb-2 font-medium text-shield-cyan/80">Call-record Example:</p>
              <code className="block rounded bg-shield-navy p-2 font-mono text-[10px] text-white/70">
                call_id, timestamp, source_number, destination_number, duration, location
              </code>
            </div>
          )}
        </div>

        {/* Section 5: Data Preview */}
        {hasDataset && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-shield-muted">
              <TableIcon className="h-3.5 w-3.5" /> Data Preview
            </h4>
            <div className="overflow-x-auto rounded-lg border border-shield-cyan/10 bg-shield-navy/40">
              <table className="w-full text-left text-[10px] text-shield-muted">
                <thead className="border-b border-shield-cyan/10 bg-shield-navy-light/50 text-white">
                  <tr>
                    <th className="px-3 py-2 font-medium">timestamp</th>
                    <th className="px-3 py-2 font-medium">source</th>
                    <th className="px-3 py-2 font-medium">destination</th>
                    <th className="px-3 py-2 font-medium">amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-shield-cyan/5">
                  <tr className="hover:bg-shield-cyan/5">
                    <td className="px-3 py-1.5 whitespace-nowrap">2024-05-12 09:15</td>
                    <td className="px-3 py-1.5 font-mono">VICTIM-03</td>
                    <td className="px-3 py-1.5 font-mono">ACC-2087</td>
                    <td className="px-3 py-1.5">₹150,000</td>
                  </tr>
                  <tr className="hover:bg-shield-cyan/5">
                    <td className="px-3 py-1.5 whitespace-nowrap">2024-05-12 09:18</td>
                    <td className="px-3 py-1.5 font-mono">ACC-2087</td>
                    <td className="px-3 py-1.5 font-mono">ACC-1048</td>
                    <td className="px-3 py-1.5">₹148,000</td>
                  </tr>
                  <tr className="hover:bg-shield-cyan/5">
                    <td className="px-3 py-1.5 whitespace-nowrap">2024-05-12 11:30</td>
                    <td className="px-3 py-1.5 font-mono">VICTIM-08</td>
                    <td className="px-3 py-1.5 font-mono">ACC-2087</td>
                    <td className="px-3 py-1.5">₹300,000</td>
                  </tr>
                  <tr className="hover:bg-shield-cyan/5">
                    <td className="px-3 py-1.5 whitespace-nowrap">2024-05-14 11:45</td>
                    <td className="px-3 py-1.5 font-mono">VICTIM-12</td>
                    <td className="px-3 py-1.5 font-mono">UPI-14</td>
                    <td className="px-3 py-1.5">₹120,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Section 6: Primary Action */}
      <div className="mt-5 border-t border-shield-cyan/10 pt-4">
        <Button
          onClick={onGenerateNetwork}
          disabled={!hasDataset || isAnalyzing}
          className="w-full bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90 disabled:cursor-not-allowed disabled:bg-shield-navy-light disabled:text-shield-muted"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-shield-navy/20 border-t-shield-navy" />
              Processing Network...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Network className="h-4 w-4" /> Generate Fraud Network
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
