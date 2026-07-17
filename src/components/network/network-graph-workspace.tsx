"use client"

import { useState, useRef, MouseEvent as ReactMouseEvent } from "react"
import { InvestigationDataset, NetworkAnalysisState, FraudEntity } from "@/lib/types/network"
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RefreshCw, 
  Filter, 
  Download,
  AlertTriangle,
  Users,
  Smartphone,
  CreditCard,
  Building2,
  HelpCircle
} from "lucide-react"

interface Props {
  dataset: InvestigationDataset | null
  state: NetworkAnalysisState
  selectedEntityId: string | null
  onSelectEntity: (id: string | null) => void
}

export function NetworkGraphWorkspace({ dataset, state, selectedEntityId, onSelectEntity }: Props) {
  const isIdle = state === "idle" || state === "error"
  const isAnalyzing = state !== "idle" && state !== "complete" && state !== "error"
  const isComplete = state === "complete" && dataset !== null

  // Pan and Zoom State
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: ReactMouseEvent) => {
    // Only pan on the background, not on nodes
    if ((e.target as HTMLElement).tagName !== 'svg' && (e.target as HTMLElement).tagName !== 'rect') return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "Suspected Coordinator": return <AlertTriangle className="h-4 w-4" />
      case "Potential Money Mule": return <RefreshCw className="h-4 w-4" />
      case "High-Risk Account": return <CreditCard className="h-4 w-4" />
      case "Victim": return <Users className="h-4 w-4" />
      case "Phone Number": return <Smartphone className="h-4 w-4" />
      case "Merchant": return <Building2 className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "#f87171" // red-400
      case "Medium": return "#fbbf24" // amber-400
      case "Low": return "#4ade80" // green-400
      default: return "#9ca3af" // gray-400
    }
  }

  return (
    <div className="flex flex-col min-h-[400px] lg:min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl shadow-shield-cyan/5 backdrop-blur-sm overflow-hidden">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-shield-cyan/10 bg-shield-navy/50 p-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Connected Fraud Network</h2>
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
              {isAnalyzing ? "Generating Network" : isComplete ? "Investigation Ready" : "Awaiting Investigation Dataset"}
            </span>
          </div>
        </div>
        
        {/* Graph Controls */}
        {isComplete && (
          <div className="flex gap-2">
            <div className="flex items-center rounded-md border border-shield-cyan/10 bg-shield-navy-light/50 p-1">
              <button onClick={() => alert("Filter functionality available in full enterprise version.")} className="rounded px-2 py-1 text-shield-muted hover:bg-shield-cyan/10 hover:text-white" title="Filter Risk">
                <Filter className="h-4 w-4" />
              </button>
              <button onClick={() => alert("Search functionality available in full enterprise version.")} className="rounded px-2 py-1 text-shield-muted hover:bg-shield-cyan/10 hover:text-white" title="Search Entity">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center rounded-md border border-shield-cyan/10 bg-shield-navy-light/50 p-1">
              <button onClick={handleZoomOut} className="rounded px-2 py-1 text-shield-muted hover:bg-shield-cyan/10 hover:text-white" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={handleReset} className="rounded px-2 py-1 text-xs font-medium text-shield-muted hover:bg-shield-cyan/10 hover:text-white" title="Reset View">
                {Math.round(scale * 100)}%
              </button>
              <button onClick={handleZoomIn} className="rounded px-2 py-1 text-shield-muted hover:bg-shield-cyan/10 hover:text-white" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => alert("Exporting high-resolution network map...")} className="flex items-center gap-1.5 rounded-md border border-shield-cyan/20 bg-shield-cyan/10 px-3 py-1.5 text-xs font-medium text-shield-cyan transition-colors hover:bg-shield-cyan/20" title="Export View">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        )}
      </div>

      <div className="relative flex-1 bg-[#0a1120] overflow-hidden" ref={containerRef}>
        
        {/* Empty State */}
        {!dataset && !isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-shield-cyan/20 bg-shield-cyan/5">
              <Network className="h-10 w-10 text-shield-cyan/40" />
            </div>
            <h3 className="text-lg font-semibold text-white">Upload a dataset to generate connected intelligence.</h3>
            <p className="mt-3 max-w-[400px] text-sm text-shield-muted">
              Potential clusters, high-risk entities, transaction paths, and connected victims will appear here.
            </p>
          </div>
        )}

        {/* Processing State */}
        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm z-10 bg-[#0a1120]/80">
            <Network className="h-12 w-12 text-shield-cyan animate-pulse mb-6" />
            <div className="w-full max-w-sm rounded-lg border border-shield-cyan/20 bg-shield-navy-light/50 p-5 shadow-2xl">
              <p className="text-sm font-medium text-white mb-4 text-left">
                {state === "validating" && "Validating investigation records..."}
                {state === "extracting" && "Extracting entities and relationships..."}
                {state === "building" && "Building network connections..."}
                {state === "identifying" && "Identifying potential clusters..."}
                {state === "calculating" && "Calculating preliminary risk indicators..."}
                {state === "preparing" && "Preparing explainable intelligence..."}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-shield-cyan/10">
                <div className="h-full bg-shield-cyan transition-all duration-500 ease-out" 
                  style={{
                    width: state === "validating" ? "15%" :
                           state === "extracting" ? "30%" :
                           state === "building" ? "50%" :
                           state === "identifying" ? "70%" : 
                           state === "calculating" ? "85%" : "95%"
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* SVG Graph Canvas */}
        {isComplete && dataset && (
          <div 
            className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg 
              width="100%" 
              height="100%" 
              className="absolute inset-0"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              {/* Background Rect to catch drag events */}
              <rect width="2000" height="2000" x="-500" y="-500" fill="transparent" />
              
              {/* Edges */}
              <g className="edges">
                {dataset.relationships.map(rel => {
                  const source = dataset.entities.find(e => e.id === rel.sourceId)
                  const target = dataset.entities.find(e => e.id === rel.targetId)
                  if (!source || !target) return null
                  
                  const isSelected = selectedEntityId === source.id || selectedEntityId === target.id
                  const isDimmed = selectedEntityId !== null && !isSelected

                  return (
                    <line 
                      key={rel.id}
                      x1={source.x} 
                      y1={source.y} 
                      x2={target.x} 
                      y2={target.y} 
                      stroke={isSelected ? "#00d4ff" : "#1e3a5f"}
                      strokeWidth={isSelected ? rel.weight * 1.5 : rel.weight}
                      opacity={isDimmed ? 0.15 : isSelected ? 0.9 : 0.4}
                      className="transition-all duration-300"
                    />
                  )
                })}
              </g>

              {/* Nodes */}
              <g className="nodes">
                {dataset.entities.map(entity => {
                  const isSelected = selectedEntityId === entity.id
                  const isDimmed = selectedEntityId !== null && !isSelected
                  const color = getRiskColor(entity.riskLevel)
                  
                  return (
                    <g 
                      key={entity.id} 
                      transform={`translate(${entity.x}, ${entity.y})`}
                      className="cursor-pointer transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEntity(entity.id)
                      }}
                      opacity={isDimmed ? 0.2 : 1}
                    >
                      {/* Selection Glow */}
                      {isSelected && (
                        <circle r="35" fill="none" stroke="#00d4ff" strokeWidth="2" className="animate-pulse opacity-50" />
                      )}
                      
                      {/* Node Shape */}
                      {entity.type === "Merchant" || entity.type === "Bank Account" ? (
                        <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#0f172a" stroke={isSelected ? "#00d4ff" : color} strokeWidth={isSelected ? 3 : 2} />
                      ) : (
                        <circle r="18" fill="#0f172a" stroke={isSelected ? "#00d4ff" : color} strokeWidth={isSelected ? 3 : 2} />
                      )}
                      
                      {/* Node Icon - Rendered via foreignObject to use Lucide React icons cleanly */}
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <div className="w-full h-full flex items-center justify-center" style={{ color: isSelected ? "#00d4ff" : color }}>
                          {getEntityIcon(entity.type)}
                        </div>
                      </foreignObject>

                      {/* Node Label */}
                      <text 
                        y="30" 
                        textAnchor="middle" 
                        fill={isSelected ? "#ffffff" : "#94a3b8"} 
                        fontSize="10px" 
                        fontWeight={isSelected ? "bold" : "normal"}
                        className="pointer-events-none select-none drop-shadow-md"
                      >
                        {entity.label}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
            
            {/* Legend (Fixed bottom left overlay) */}
            <div className="absolute bottom-4 left-4 rounded-md border border-shield-cyan/10 bg-shield-navy-light/80 p-3 backdrop-blur-md text-[10px] text-shield-muted">
              <div className="font-semibold text-white mb-2 uppercase tracking-wider">Risk Legend</div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-400" /> High Priority</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Review Recommended</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400" /> Lower Risk / Verified</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-400" /> Unknown / Reference</div>
              </div>
            </div>
            
          </div>
        )}

      </div>
    </div>
  )
}
