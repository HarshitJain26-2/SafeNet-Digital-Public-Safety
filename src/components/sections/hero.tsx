"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion"
import { ShieldCheck, Brain, Search, Users } from "lucide-react"
import { IntelligencePreview } from "@/components/intelligence-preview"

const credibilityItems = [
  { icon: Brain, label: "Multi-Modal AI" },
  { icon: ShieldCheck, label: "Explainable Risk Scoring" },
  { icon: Search, label: "Proactive Threat Detection" },
  { icon: Users, label: "Built for Citizens, Banks & Law Enforcement" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16" id="hero">
      {/* Cinematic background lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate">
        {/* Cyan spotlight from top */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
        {/* Blue accent bottom-right */}
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.06)_0%,transparent_70%)]" />
        {/* Grid texture */}
        <div className="shield-grid-bg absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-12 text-center lg:pt-28 lg:pb-16">
          {/* Eyebrow badge */}
          <FadeIn delay={0}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-shield-cyan/20 bg-shield-cyan/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-shield-cyan animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-widest text-shield-cyan">
                AI-Powered Digital Public Safety Intelligence
              </span>
            </div>
          </FadeIn>

          {/* Main heading */}
          <FadeIn delay={0.1}>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Detect Threats Before{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                They Become Losses.
              </span>
            </h1>
          </FadeIn>

          {/* Supporting copy */}
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-shield-muted">
              ShieldAI helps citizens detect digital scams, enables AI-assisted currency
              verification, and empowers law enforcement to uncover organized fraud networks
              through explainable intelligence.
            </p>
          </FadeIn>

          {/* Tagline */}
          <FadeIn delay={0.25}>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-shield-cyan/60">
              Detect &bull; Prevent &bull; Protect
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                asChild
                className="w-full bg-shield-cyan text-shield-navy font-semibold hover:bg-shield-cyan/90 shadow-[0_0_30px_rgba(0,212,255,0.2)] sm:w-auto"
              >
                <Link href="/citizen">Launch ShieldAI</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full border-shield-cyan/20 text-shield-muted hover:text-white hover:border-shield-cyan/40 hover:bg-shield-cyan/5 sm:w-auto"
              >
                <Link href="#platform">Explore Intelligence Platform</Link>
              </Button>
            </div>
          </FadeIn>

          {/* Credibility indicators */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {credibilityItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5 text-shield-cyan/50" />
                  <span className="text-xs font-medium text-shield-muted/70">{item.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Product interface preview */}
        <FadeIn delay={0.5}>
          <div className="mx-auto max-w-6xl pb-8 lg:pb-0">
            <div className="lg:[perspective:1400px]">
              <div className="lg:[transform:rotateX(8deg)] transition-transform duration-700">
                <IntelligencePreview />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
