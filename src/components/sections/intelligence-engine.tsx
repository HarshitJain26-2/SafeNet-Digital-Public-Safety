"use client"

import { FadeIn } from "@/components/motion"
import {
  FileText,
  Mic,
  Camera,
  Banknote,
  Database,
  Phone,
  MapPin,
  Brain,
  ShieldCheck,
  MessageSquare,
  Eye,
  AudioLines,
  Network,
  Gauge,
  Lightbulb,
  Upload,
} from "lucide-react"

const inputs = [
  { icon: MessageSquare, label: "Text" },
  { icon: Mic, label: "Voice" },
  { icon: Camera, label: "Screenshots" },
  { icon: Banknote, label: "Currency Images" },
  { icon: Database, label: "Transaction Data" },
  { icon: Phone, label: "Call Records" },
  { icon: MapPin, label: "Regional Crime Data" },
]

const aiModules = [
  { icon: FileText, label: "Language AI", color: "text-shield-cyan" },
  { icon: Eye, label: "Vision AI", color: "text-shield-blue" },
  { icon: AudioLines, label: "Speech AI", color: "text-violet-400" },
  { icon: Network, label: "Graph Intelligence", color: "text-shield-warning" },
]

const agents = [
  "Input Agent",
  "Language Agent",
  "Vision Agent",
  "Speech Agent",
  "Fraud Detection Agent",
  "Graph Intelligence Agent",
  "Risk Scoring Agent",
  "Recommendation Agent",
  "Complaint Generation Agent",
  "Evidence Logger",
]

const outputs = [
  { icon: Gauge, label: "Threat Score" },
  { icon: Lightbulb, label: "Explainable Evidence" },
  { icon: ShieldCheck, label: "Recommendation" },
]

export function IntelligenceEngine() {
  return (
    <section id="intelligence-engine" className="relative py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 shield-grid-bg opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Multi-Modal Signals.{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                One Explainable Intelligence Engine.
              </span>
            </h2>
          </div>
        </FadeIn>

        {/* Architecture flow */}
        <div className="mt-16 space-y-8">
          {/* Inputs */}
          <FadeIn delay={0.1}>
            <FlowStage label="Inputs" sublabel="Multi-modal data ingestion">
              <div className="flex flex-wrap justify-center gap-3">
                {inputs.map((input) => (
                  <div
                    key={input.label}
                    className="flex items-center gap-2 rounded-lg border border-shield-cyan/10 bg-shield-navy/60 px-3 py-2"
                  >
                    <input.icon className="h-4 w-4 text-shield-cyan/60" />
                    <span className="text-xs font-medium text-shield-muted">{input.label}</span>
                  </div>
                ))}
              </div>
            </FlowStage>
          </FadeIn>

          <FlowConnector />

          {/* Input Processing */}
          <FadeIn delay={0.15}>
            <FlowStage label="Input Processing" sublabel="Normalization & feature extraction">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-shield-blue/15 bg-shield-navy/60 px-4 py-2.5">
                <Upload className="h-4 w-4 text-shield-blue/60" />
                <span className="text-xs font-medium text-shield-muted">Pre-processing Pipeline</span>
              </div>
            </FlowStage>
          </FadeIn>

          <FlowConnector />

          {/* AI Modules */}
          <FadeIn delay={0.2}>
            <FlowStage label="AI Analysis Modules" sublabel="Specialized intelligence processing">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {aiModules.map((mod) => (
                  <div
                    key={mod.label}
                    className="flex flex-col items-center gap-2 rounded-lg border border-shield-cyan/10 bg-shield-navy/60 p-4 text-center"
                  >
                    <mod.icon className={`h-6 w-6 ${mod.color}`} />
                    <span className="text-xs font-medium text-white">{mod.label}</span>
                  </div>
                ))}
              </div>
            </FlowStage>
          </FadeIn>

          <FlowConnector />

          {/* Risk Engine */}
          <FadeIn delay={0.25}>
            <FlowStage label="ShieldAI Risk Engine" sublabel="Centralized scoring & decision support">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 rounded-xl border border-shield-cyan/20 bg-gradient-to-r from-shield-cyan/5 to-shield-blue/5 px-6 py-3 shadow-lg shadow-shield-cyan/5">
                  <Brain className="h-6 w-6 text-shield-cyan" />
                  <span className="text-sm font-semibold text-white">Unified Intelligence Engine</span>
                </div>
              </div>
            </FlowStage>
          </FadeIn>

          <FlowConnector />

          {/* Outputs */}
          <FadeIn delay={0.3}>
            <FlowStage label="Outputs" sublabel="Actionable intelligence">
              <div className="flex flex-wrap justify-center gap-3">
                {outputs.map((output) => (
                  <div
                    key={output.label}
                    className="flex items-center gap-2 rounded-lg border border-shield-safe/15 bg-shield-navy/60 px-4 py-2.5"
                  >
                    <output.icon className="h-4 w-4 text-shield-safe/70" />
                    <span className="text-xs font-medium text-shield-muted">{output.label}</span>
                  </div>
                ))}
              </div>
            </FlowStage>
          </FadeIn>

          <FlowConnector />

          {/* Protective Action */}
          <FadeIn delay={0.35}>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-lg border border-shield-safe/20 bg-shield-safe/5 px-5 py-3">
                <ShieldCheck className="h-5 w-5 text-shield-safe" />
                <span className="text-sm font-semibold text-shield-safe">Protective or Investigative Action</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Specialized agents */}
        <FadeIn delay={0.4}>
          <div className="mt-16">
            <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-shield-muted/50">
              Specialized Orchestrated Stages
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {agents.map((agent) => (
                <span
                  key={agent}
                  className="rounded-full border border-shield-cyan/10 bg-shield-navy/60 px-3 py-1 text-xs text-shield-muted/60"
                >
                  {agent}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-shield-muted/40">
              Specialized stages within an orchestrated AI workflow — not autonomous agents.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function FlowStage({
  label,
  sublabel,
  children,
}: {
  label: string
  sublabel: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-shield-cyan/10 bg-shield-navy-light/30 p-6">
      <div className="mb-4 text-center">
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <p className="text-xs text-shield-muted/50">{sublabel}</p>
      </div>
      {children}
    </div>
  )
}

function FlowConnector() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <div className="flex flex-col items-center gap-1">
        <div className="h-4 w-px bg-gradient-to-b from-shield-cyan/30 to-shield-cyan/10" />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M6 8L0 0H12L6 8Z" fill="rgba(0,212,255,0.25)" />
        </svg>
      </div>
    </div>
  )
}
