"use client"

import { Zap, Eye, Clock, Network, FileText, MapPin } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"

const impacts = [
  {
    icon: Zap,
    title: "Sub-5-Second Analysis",
    description: "Target suspicious-content analysis in under five seconds.",
  },
  {
    icon: Eye,
    title: "Early Warning Signs",
    description: "Help citizens identify warning signs before transferring money.",
  },
  {
    icon: Clock,
    title: "Faster Currency Screening",
    description: "Reduce preliminary currency-screening time from minutes to seconds.",
  },
  {
    icon: Network,
    title: "Network Discovery",
    description: "Help investigators uncover connected fraud networks through graph analysis.",
  },
  {
    icon: FileText,
    title: "Explainable Evidence",
    description: "Provide explainable evidence for faster risk prioritization.",
  },
  {
    icon: MapPin,
    title: "Regional Intelligence",
    description: "Support intelligence-led regional resource planning.",
  },
]

export function ExpectedImpact() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 shield-grid-bg opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Designed for Faster,{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Explainable Decision Support
              </span>
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-shield-warning/20 bg-shield-warning/5 px-4 py-1.5">
              <span className="text-xs font-medium text-shield-warning">
                Prototype Targets &amp; Expected Impact
              </span>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" delay={0.2}>
          {impacts.map((impact) => (
            <StaggerItem key={impact.title}>
              <div className="group flex items-start gap-4 rounded-xl border border-shield-cyan/10 bg-shield-navy-light/30 p-5 transition-all duration-300 hover:border-shield-cyan/20 hover:bg-shield-navy-light/60">
                <div className="rounded-lg bg-shield-cyan/5 p-2.5">
                  <impact.icon className="h-5 w-5 text-shield-cyan/60" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{impact.title}</h3>
                  <p className="mt-1 text-sm text-shield-muted/70">{impact.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
