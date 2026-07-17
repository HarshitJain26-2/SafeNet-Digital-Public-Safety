"use client"

import {
  ShieldCheck,
  Banknote,
  Network,
  MapPin,
  LayoutDashboard,
  Brain,
} from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"

const capabilities = [
  {
    icon: ShieldCheck,
    title: "AI Citizen Fraud Shield",
    description:
      "Analyze suspicious messages, voice input, screenshots, payment requests, and impersonation patterns.",
    features: [
      "Threat score",
      "Scam classification",
      "Explainable evidence",
      "Safety guidance",
      "Complaint drafting",
      "Hindi & English support",
    ],
    accent: "from-shield-cyan to-shield-blue",
    borderAccent: "border-shield-cyan/15 hover:border-shield-cyan/30",
  },
  {
    icon: Banknote,
    title: "AI Counterfeit Currency Detection",
    description:
      "Assist preliminary currency screening through computer vision and explainable security-feature analysis.",
    features: [
      "Camera & image input",
      "Authenticity-risk assessment",
      "Security-feature checklist",
      "Suspicious-region highlighting",
      "Manual-verification recommendation",
    ],
    accent: "from-shield-blue to-indigo-500",
    borderAccent: "border-shield-blue/15 hover:border-shield-blue/30",
  },
  {
    icon: Network,
    title: "AI Fraud Network Analysis",
    description:
      "Transform transaction and call-record data into connected intelligence for investigators.",
    features: [
      "Interactive network graph",
      "Fraud-cluster detection",
      "Money-mule indicators",
      "High-risk entity analysis",
      "Evidence timeline",
      "Investigation summary",
    ],
    accent: "from-amber-400 to-shield-warning",
    borderAccent: "border-shield-warning/15 hover:border-shield-warning/30",
  },
  {
    icon: MapPin,
    title: "AI Geospatial Crime Intelligence",
    description:
      "Visualize regional cybercrime patterns and support intelligence-led resource prioritization.",
    features: [
      "Crime heatmap",
      "State & district filters",
      "Category analysis",
      "Fraud-density insights",
      "AI deployment recommendations",
    ],
    accent: "from-shield-safe to-emerald-400",
    borderAccent: "border-shield-safe/15 hover:border-shield-safe/30",
  },
  {
    icon: LayoutDashboard,
    title: "Police Investigation Dashboard",
    description:
      "Provide a unified operational view of cases, risks, evidence, and investigation progress.",
    features: [
      "Active cases",
      "High-risk alerts",
      "Case status",
      "Investigation timeline",
      "Operational analytics",
    ],
    accent: "from-shield-high-risk to-rose-400",
    borderAccent: "border-shield-high-risk/15 hover:border-shield-high-risk/30",
  },
  {
    icon: Brain,
    title: "ShieldAI Intelligence & Risk Engine",
    description:
      "Convert multi-modal evidence into explainable threat scores, recommendations, and protective actions.",
    features: [
      "Language intelligence",
      "Vision intelligence",
      "Speech intelligence",
      "Graph intelligence",
      "Risk scoring",
      "Recommendation generation",
    ],
    accent: "from-shield-cyan to-violet-400",
    borderAccent: "border-shield-cyan/15 hover:border-shield-cyan/30",
  },
]

export function PlatformCapabilities() {
  return (
    <section id="platform" className="relative py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 shield-grid-bg opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One Intelligence Platform.{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Multiple Lines of Defense.
              </span>
            </h2>
            <p className="mt-4 text-lg text-shield-muted">
              ShieldAI unifies citizen protection, currency verification, fraud investigation,
              and geospatial intelligence in one explainable platform.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.2}>
          {capabilities.map((cap) => (
            <StaggerItem key={cap.title}>
              <div
                className={`group relative flex h-full flex-col rounded-xl border bg-shield-navy-light/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-shield-navy-light/80 hover:shadow-xl hover:shadow-shield-cyan/5 sm:p-6 ${cap.borderAccent}`}
              >
                {/* Icon */}
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${cap.accent} p-2 transition-transform duration-300 group-hover:scale-110`}>
                  <cap.icon className="h-5 w-5 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-1.5 text-base font-semibold text-white">{cap.title}</h3>
                <p className="mb-4 text-xs leading-relaxed text-shield-muted">{cap.description}</p>

                {/* Features */}
                <ul className="mt-auto space-y-2 border-t border-shield-cyan/5 pt-4">
                  {cap.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[11px] text-shield-muted/70 transition-colors duration-200 group-hover:text-shield-muted">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-shield-cyan/40 transition-colors duration-200 group-hover:bg-shield-cyan/80" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
