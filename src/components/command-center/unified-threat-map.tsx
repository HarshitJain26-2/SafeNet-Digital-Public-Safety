"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { CommandCase } from "@/lib/types/command-center"
import { MapIcon, Layers } from "lucide-react"

interface Props {
  cases: CommandCase[]
  selectedCaseId: string | null
  onSelectCase: (id: string | null) => void
}

function MapController({ selectedCase, cases }: { selectedCase: CommandCase | null, cases: CommandCase[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedCase) {
      map.flyTo([selectedCase.lat, selectedCase.lng], 10, {
        duration: 1.5,
        easeLinearity: 0.25
      })
    } else if (cases.length > 0) {
      map.flyTo([22.5937, 78.9629], 4.5, { duration: 1.5 })
    }
  }, [selectedCase, map, cases])

  return null
}

export default function UnifiedThreatMap({ cases, selectedCaseId, onSelectCase }: Props) {
  const [mapMode, setMapMode] = useState<"Threat Map" | "Active Cases" | "Network Activity">("Threat Map")
  
  const createCustomIcon = (risk: string, isSelected: boolean) => {
    let color = "#4ade80" // Low (Green)
    let shadow = "rgba(74, 222, 128, 0.3)"
    let pulseClass = ""
    
    if (risk === "Medium") { color = "#facc15"; shadow = "rgba(250, 204, 21, 0.3)" } // Yellow
    if (risk === "High") { color = "#fbbf24"; shadow = "rgba(251, 191, 36, 0.4)" } // Amber
    if (risk === "Critical") { 
      color = "#f87171" // Red
      shadow = "rgba(248, 113, 113, 0.6)"
      pulseClass = "animate-ping" // Pulse animation for critical markers
    }

    const size = isSelected ? 24 : 16
    const html = `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        ${risk === "Critical" ? `<div class="${pulseClass}" style="position: absolute; inset: -4px; border-radius: 50%; background-color: ${color}; opacity: 0.4;"></div>` : ''}
        <div style="
          position: absolute; inset: 0;
          background-color: ${color};
          border-radius: 50%;
          border: ${isSelected ? '3px' : '2px'} solid #ffffff;
          box-shadow: 0 0 ${isSelected ? '20px 8px' : '10px 4px'} ${shadow};
          transition: all 0.3s ease;
        "></div>
      </div>
    `
    return L.divIcon({
      html,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    })
  }

  const selectedCase = cases.find(c => c.id === selectedCaseId) || null

  return (
    <div className="flex flex-col h-[500px] lg:h-full min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl overflow-hidden relative">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-shield-cyan/10 bg-shield-navy/70 backdrop-blur-md p-3 sm:p-4 absolute top-0 w-full z-[1000]">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-shield-cyan" />
            Unified Threat Operations
          </h2>
        </div>
        
        {/* Map View Controls */}
        <div className="flex bg-shield-navy rounded border border-shield-cyan/20">
          {["Threat Map", "Active Cases", "Network Activity"].map(mode => (
            <button
              key={mode}
              onClick={() => setMapMode(mode as "Threat Map" | "Active Cases" | "Network Activity")}
              className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors ${
                mapMode === mode 
                  ? "bg-shield-cyan/20 text-white" 
                  : "text-shield-muted hover:text-white hover:bg-shield-cyan/10"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-[#0a1120] relative z-0 mt-[60px] sm:mt-[72px]">
        <MapContainer 
          center={[22.5937, 78.9629]} 
          zoom={4.5} 
          minZoom={4}
          zoomControl={false}
          style={{ width: "100%", height: "100%", background: "#0a1120" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapController selectedCase={selectedCase} cases={cases} />

          {cases.map(c => (
            <Marker 
              key={c.id}
              position={[c.lat, c.lng]}
              icon={createCustomIcon(c.riskLevel, selectedCaseId === c.id)}
              eventHandlers={{
                click: () => onSelectCase(c.id === selectedCaseId ? null : c.id)
              }}
            >
              <Tooltip direction="top" offset={[0, -15]} opacity={1} className="custom-leaflet-tooltip">
                <div className="bg-shield-navy p-3 rounded-lg border border-shield-cyan/20 text-left min-w-[200px]">
                  <div className="text-sm font-bold text-white mb-0.5">{c.location}</div>
                  <div className="text-xs text-shield-muted border-b border-shield-cyan/10 pb-2 mb-2 flex justify-between items-center">
                    <span>Risk Level:</span> 
                    <span className={`font-bold ${
                      c.riskLevel === "Critical" ? "text-red-400" : 
                      c.riskLevel === "High" ? "text-amber-400" : "text-yellow-400"
                    }`}>
                      {c.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-white mb-1"><span className="text-shield-muted">Threat:</span> {c.threatCategory}</div>
                  <div className="text-xs text-white"><span className="text-shield-muted">Case ID:</span> {c.id}</div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 sm:bottom-4 sm:left-4 sm:right-auto z-[1000] rounded-lg border border-shield-cyan/15 bg-shield-navy/90 p-3 backdrop-blur-md">
          <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="h-3 w-3" /> Map Legend
          </div>
          <div className="flex flex-col gap-2 text-xs text-shield-muted">
            <div className="flex items-center gap-2"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white shadow-[0_0_8px_rgba(248,113,113,0.6)]"></span></span> Critical</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_8px_rgba(251,191,36,0.4)]" /> High</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-400 border-2 border-white shadow-[0_0_8px_rgba(250,204,21,0.3)]" /> Medium</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { font-family: inherit; }
        .custom-leaflet-tooltip.leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          color: white;
        }
        .custom-leaflet-tooltip.leaflet-tooltip-top:before {
          border-top-color: rgba(0, 212, 255, 0.4) !important;
          bottom: -2px !important;
        }
      `}} />
    </div>
  )
}
