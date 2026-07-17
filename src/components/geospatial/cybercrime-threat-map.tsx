"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { CrimeHotspot } from "@/lib/types/geospatial"
import { Layers, Map as MapIcon, ShieldAlert } from "lucide-react"

interface Props {
  hotspots: CrimeHotspot[]
  selectedHotspotId: string | null
  onSelectHotspot: (id: string | null) => void
  isApplying: boolean
}

// Map bounds controller to automatically pan/zoom when a hotspot is selected
function MapController({ selectedHotspot, hotspots }: { selectedHotspot: CrimeHotspot | null, hotspots: CrimeHotspot[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedHotspot) {
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 7, {
        duration: 1.5,
        easeLinearity: 0.25
      })
    } else if (hotspots.length > 0) {
      // If we unselect, maybe reset to full bounds if we want, but for now we'll just stay put.
      // Or we can reset to India center
      map.flyTo([22.5937, 78.9629], 4.5, { duration: 1.5 })
    }
  }, [selectedHotspot, map, hotspots])

  return null
}

export default function CybercrimeThreatMap({ hotspots, selectedHotspotId, onSelectHotspot, isApplying }: Props) {
  const [mapMode, setMapMode] = useState<"Hotspots" | "Heatmap" | "Cluster">("Hotspots")
  
  // Custom marker icon builder
  const createCustomIcon = (risk: string, isSelected: boolean) => {
    let color = "#4ade80" // Low
    let shadow = "rgba(74, 222, 128, 0.3)"
    
    if (risk === "Medium") { color = "#fbbf24"; shadow = "rgba(251, 191, 36, 0.3)" }
    if (risk === "High") { color = "#f97316"; shadow = "rgba(249, 115, 22, 0.4)" }
    if (risk === "Critical") { color = "#f87171"; shadow = "rgba(248, 113, 113, 0.5)" }

    const size = isSelected ? 24 : 16
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        border: ${isSelected ? '3px' : '2px'} solid #ffffff;
        box-shadow: 0 0 ${isSelected ? '20px 8px' : '10px 4px'} ${shadow};
        transition: all 0.3s ease;
        transform: translate(-50%, -50%);
      "></div>
    `
    return L.divIcon({
      html,
      className: "",
      iconSize: [0, 0], // Handled in html
      iconAnchor: [0, 0]
    })
  }

  const selectedHotspot = hotspots.find(h => h.id === selectedHotspotId) || null

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-[500px] rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl shadow-shield-cyan/5 overflow-hidden relative">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-shield-cyan/10 bg-shield-navy/50 p-4 absolute top-0 w-full z-[1000]">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-shield-cyan" />
            Cybercrime Threat Map
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isApplying ? "bg-shield-cyan" : "bg-red-400"
              }`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                isApplying ? "bg-shield-cyan" : "bg-red-500"
              }`} />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-shield-muted">
              {isApplying ? "Updating Map Data..." : "Live Regional Intelligence"}
            </span>
          </div>
        </div>
        
        {/* Map View Controls */}
        <div className="flex bg-shield-navy rounded-md p-1 border border-shield-cyan/20">
          {["Hotspots", "Heatmap", "Cluster"].map(mode => (
            <button
              key={mode}
              onClick={() => setMapMode(mode as "Hotspots" | "Heatmap" | "Cluster")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
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
      <div className="flex-1 w-full bg-[#0a1120] relative z-0 mt-[72px]">
        {/* We use a dark base map. CartoDB Dark Matter is standard for dashboards without an API key */}
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
          
          <MapController selectedHotspot={selectedHotspot} hotspots={hotspots} />

          {hotspots.map(hotspot => (
            <Marker 
              key={hotspot.id}
              position={[hotspot.lat, hotspot.lng]}
              icon={createCustomIcon(hotspot.riskLevel, selectedHotspotId === hotspot.id)}
              eventHandlers={{
                click: () => {
                  onSelectHotspot(hotspot.id === selectedHotspotId ? null : hotspot.id)
                }
              }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -15]} 
                opacity={1}
                className="custom-leaflet-tooltip"
              >
                <div className="bg-shield-navy p-3 rounded-lg border border-shield-cyan/20 text-left min-w-[200px]">
                  <div className="text-sm font-bold text-white mb-0.5">{hotspot.regionName}, {hotspot.stateName}</div>
                  <div className="text-xs text-shield-muted border-b border-shield-cyan/10 pb-2 mb-2 flex justify-between items-center">
                    <span>Risk Level:</span> 
                    <span className={`font-bold ${
                      hotspot.riskLevel === "Critical" || hotspot.riskLevel === "High" ? "text-red-400" : 
                      hotspot.riskLevel === "Medium" ? "text-amber-400" : "text-green-400"
                    }`}>
                      {hotspot.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-white mb-1"><span className="text-shield-muted">Primary Threat:</span> {hotspot.primaryThreat}</div>
                  <div className="text-xs text-white mb-1"><span className="text-shield-muted">Reported Incidents:</span> {hotspot.reportedIncidents}</div>
                  <div className="text-xs text-white"><span className="text-shield-muted">Trend:</span> {hotspot.trend}</div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Loading Overlay */}
        {isApplying && (
          <div className="absolute inset-0 bg-shield-navy/50 backdrop-blur-sm z-[2000] flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-shield-cyan/20 border-t-shield-cyan" />
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-shield-cyan/15 bg-shield-navy/90 p-3 backdrop-blur-md">
          <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="h-3 w-3" /> Risk Visualization
          </div>
          <div className="flex flex-col gap-2 text-xs text-shield-muted">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" /> Critical Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.4)]" /> High Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]" /> Medium Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]" /> Low Risk</div>
          </div>
        </div>
        
      </div>
      
      {/* We inject standard leaflet CSS override via global styles or inline here to fix tooltip styling */}
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
