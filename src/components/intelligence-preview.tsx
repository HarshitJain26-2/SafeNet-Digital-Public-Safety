"use client"

import {
  ShieldAlert,
  Activity,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Camera,
  FileText,
  TrendingUp,
  MapPin,
  Network,
} from "lucide-react"

export function IntelligencePreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-shield-cyan/15 bg-shield-navy-light/80 shadow-2xl shadow-shield-cyan/5 backdrop-blur-sm">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-shield-cyan/10 bg-shield-navy/60 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-shield-cyan" />
          <span className="text-xs font-semibold text-white">ShieldAI Intelligence Console</span>
        </div>
        <div className="flex items-center gap-4">
          <StatusPill color="green" label="Risk Engine Active" />
          <StatusPill color="cyan" label="Live Analysis" />
          <StatusPill color="blue" label="Secure Processing" icon={<Lock className="h-3 w-3" />} />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-px bg-shield-cyan/5 lg:grid-cols-[1fr_300px]">
        {/* Left: Main analysis panel */}
        <div className="space-y-px bg-shield-navy-light">
          {/* Threat analysis card */}
          <div className="bg-shield-navy-light p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-shield-critical" />
                  <h3 className="text-sm font-semibold text-white">Digital Arrest Scam Detected</h3>
                </div>
                <p className="mt-1 text-xs text-shield-muted">Case #SA-2025-04892 &middot; Analysis completed 2s ago</p>
              </div>
              <div className="flex items-center gap-3">
                <ThreatBadge level="Critical" />
                <ThreatScore score={94} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-md border border-shield-high-risk/20 bg-shield-high-risk/10 px-2 py-0.5 text-shield-high-risk">Impersonation Scam</span>
              <span className="rounded-md border border-shield-cyan/20 bg-shield-cyan/5 px-2 py-0.5 text-shield-cyan">NLP Analysis</span>
              <span className="rounded-md border border-shield-blue/20 bg-shield-blue/5 px-2 py-0.5 text-shield-blue">Voice Pattern Match</span>
            </div>

            {/* Analysis Progress */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-shield-navy">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-shield-cyan via-shield-warning to-shield-critical" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-shield-cyan/60">Analysis Complete</span>
            </div>

            {/* Evidence panel */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-shield-cyan/10 bg-shield-navy/50 p-2.5">
                <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-shield-cyan/70">Explainable Evidence</h4>
                <ul className="space-y-2">
                  {[
                    { icon: XCircle, text: "Government officer impersonation", risk: "high" },
                    { icon: AlertTriangle, text: "Urgency and fear language", risk: "high" },
                    { icon: AlertTriangle, text: "Suspicious payment request", risk: "high" },
                    { icon: XCircle, text: "Secrecy demand detected", risk: "critical" },
                    { icon: Phone, text: "Unknown communication source", risk: "medium" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <item.icon className={`mt-0.5 h-3 w-3 shrink-0 ${
                        item.risk === "critical" ? "text-shield-critical" :
                        item.risk === "high" ? "text-shield-high-risk" :
                        "text-shield-warning"
                      }`} />
                      <span className="text-xs text-shield-muted">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-shield-safe/10 bg-shield-navy/50 p-2.5">
                <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-shield-safe/70">AI Recommendations</h4>
                <ul className="space-y-2">
                  {[
                    "Do not transfer money",
                    "End suspicious communication",
                    "Preserve screenshots & payment evidence",
                    "Contact cybercrime reporting channel",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-shield-safe" />
                      <span className="text-xs text-shield-muted">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: Intelligence widgets */}
        <div className="hidden space-y-px bg-shield-navy-light lg:block">
          {/* Mini fraud network visualization */}
          <div className="border-b border-shield-cyan/10 bg-shield-navy-light p-3.5">
            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-shield-muted">
              <Network className="h-3 w-3 text-shield-cyan/60" />
              Connected Fraud Network
            </h4>
            <FraudNetworkMini />
          </div>

          {/* India hotspot mini */}
          <div className="border-b border-shield-cyan/10 bg-shield-navy-light p-3.5">
            <h4 className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-shield-muted">
              <MapPin className="h-3 w-3 text-shield-warning/60" />
              Cybercrime Hotspots
            </h4>
            <div className="space-y-1.5">
              {[
                { state: "Jharkhand", pct: 85, color: "bg-shield-critical" },
                { state: "Rajasthan", pct: 72, color: "bg-shield-high-risk" },
                { state: "Bihar", pct: 58, color: "bg-shield-warning" },
                { state: "UP", pct: 45, color: "bg-shield-warning" },
              ].map((item) => (
                <div key={item.state} className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-shield-muted">{item.state}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-shield-navy">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent threats */}
          <div className="border-b border-shield-cyan/10 bg-shield-navy-light p-3.5">
            <h4 className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-shield-muted">
              <Activity className="h-3 w-3 text-shield-cyan/60" />
              Recent Threat Activity
            </h4>
            <div className="space-y-2">
              {[
                { type: "Phishing SMS", time: "12s ago", severity: "high" },
                { type: "Fake UPI Request", time: "34s ago", severity: "critical" },
                { type: "Voice Scam", time: "1m ago", severity: "medium" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-shield-muted">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-shield-muted/50">{item.time}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      item.severity === "critical" ? "bg-shield-critical" :
                      item.severity === "high" ? "bg-shield-high-risk" :
                      "bg-shield-warning"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case priority */}
          <div className="bg-shield-navy-light p-3.5">
            <h4 className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-shield-muted">
              <TrendingUp className="h-3 w-3 text-shield-cyan/60" />
              Case Priority
            </h4>
            <div className="flex items-end gap-1.5">
              {[40, 65, 85, 55, 94, 78, 92].map((v, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`rounded-sm ${v > 80 ? "bg-shield-critical/70" : v > 60 ? "bg-shield-warning/60" : "bg-shield-cyan/30"}`}
                    style={{ height: `${v * 0.5}px` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-shield-cyan/10 bg-shield-navy/60 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4 text-[10px] text-shield-muted/50">
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> 6 Modules Active</span>
          <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> Vision Ready</span>
        </div>
        <span className="text-[10px] font-medium tracking-wider text-shield-cyan/40">SHIELDAI v1.0 PROTOTYPE</span>
      </div>
    </div>
  )
}

function StatusPill({ color, label, icon }: { color: string; label: string; icon?: React.ReactNode }) {
  const colors: Record<string, string> = {
    green: "border-shield-safe/30 bg-shield-safe/10 text-shield-safe",
    cyan: "border-shield-cyan/30 bg-shield-cyan/10 text-shield-cyan",
    blue: "border-shield-blue/30 bg-shield-blue/10 text-shield-blue",
  }
  return (
    <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${colors[color]}`}>
      {icon}
      {label}
    </span>
  )
}

function ThreatBadge({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-shield-critical/30 bg-shield-critical/10 px-2 py-0.5 text-xs font-semibold text-shield-critical">
      <AlertTriangle className="h-3 w-3" />
      {level}
    </span>
  )
}

function ThreatScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-shield-navy" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeDasharray={`${score} ${100 - score}`}
            strokeLinecap="round"
            className="text-shield-critical"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">{score}</span>
      </div>
    </div>
  )
}

function FraudNetworkMini() {
  return (
    <svg viewBox="0 0 200 100" className="h-20 w-full" aria-label="Fraud network visualization showing connected suspicious entities">
      {/* Connection lines */}
      <line x1="100" y1="30" x2="50" y2="60" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="30" x2="150" y2="55" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="30" x2="80" y2="80" stroke="#ef4444" strokeWidth="0.8" opacity="0.4" />
      <line x1="100" y1="30" x2="130" y2="85" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
      <line x1="50" y1="60" x2="80" y2="80" stroke="#f59e0b" strokeWidth="0.8" opacity="0.3" />
      <line x1="150" y1="55" x2="130" y2="85" stroke="#3b82f6" strokeWidth="0.8" opacity="0.25" />
      <line x1="50" y1="60" x2="30" y2="40" stroke="#3b82f6" strokeWidth="0.6" opacity="0.2" />
      <line x1="150" y1="55" x2="180" y2="45" stroke="#3b82f6" strokeWidth="0.6" opacity="0.2" />
      {/* Center (primary suspect) */}
      <circle cx="100" cy="30" r="6" fill="#ef4444" opacity="0.8" />
      <circle cx="100" cy="30" r="9" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
      {/* Connected entities */}
      <circle cx="50" cy="60" r="4" fill="#f59e0b" opacity="0.7" />
      <circle cx="150" cy="55" r="4.5" fill="#00d4ff" opacity="0.6" />
      <circle cx="80" cy="80" r="3.5" fill="#f59e0b" opacity="0.6" />
      <circle cx="130" cy="85" r="3" fill="#3b82f6" opacity="0.5" />
      <circle cx="30" cy="40" r="2.5" fill="#3b82f6" opacity="0.4" />
      <circle cx="180" cy="45" r="2.5" fill="#3b82f6" opacity="0.4" />
    </svg>
  )
}
