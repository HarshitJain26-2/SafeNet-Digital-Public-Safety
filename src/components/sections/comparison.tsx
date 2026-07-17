"use client"

import { XCircle, CheckCircle2, ArrowRight, ArrowDown } from "lucide-react"
import { FadeIn } from "@/components/motion"

const traditional = [
  "Investigation begins after financial loss",
  "Intelligence remains fragmented",
  "Manual evidence review",
  "Slow risk prioritization",
  "Limited visibility across connected cases",
]

const shieldai = [
  "Supports earlier threat identification",
  "Unified multi-modal intelligence",
  "Explainable risk scoring",
  "Connected fraud-network visibility",
  "Actionable recommendations",
  "Faster preliminary decision support",
]

export function ComparisonSection() {
  return (
    <section id="solutions" className="relative py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-shield-cyan/[0.02] to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Reactive Investigation to{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Proactive Protection
              </span>
            </h2>
          </div>
        </FadeIn>

        <div className="mt-16 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          {/* Traditional */}
          <FadeIn delay={0.1} direction="left" className="w-full flex-1">
            <div className="h-full rounded-xl border border-shield-high-risk/10 bg-shield-navy-light/30 p-6 opacity-80 transition-opacity duration-300 hover:opacity-100 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-shield-high-risk/10 p-2">
                  <XCircle className="h-5 w-5 text-shield-high-risk/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">Traditional Systems</h3>
              </div>
              <ul className="space-y-4">
                {traditional.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-shield-high-risk/50" />
                    <span className="text-sm text-shield-muted/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Flow Indicator */}
          <FadeIn delay={0.15} className="flex shrink-0 items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-shield-cyan/20 bg-shield-navy-light/80 shadow-[0_0_20px_rgba(0,212,255,0.15)] sm:h-12 sm:w-12">
              <ArrowRight className="hidden h-5 w-5 text-shield-cyan lg:block" />
              <ArrowDown className="block h-5 w-5 text-shield-cyan lg:hidden" />
            </div>
          </FadeIn>

          {/* ShieldAI */}
          <FadeIn delay={0.2} direction="right" className="w-full flex-1">
            <div className="relative h-full rounded-xl border border-shield-cyan/20 bg-shield-navy-light/60 p-6 shadow-xl shadow-shield-cyan/5 sm:p-8">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-shield-cyan/[0.03] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-shield-cyan/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-shield-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">ShieldAI Approach</h3>
                </div>
                <ul className="space-y-4">
                  {shieldai.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-shield-cyan/70" />
                      <span className="text-sm text-shield-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
