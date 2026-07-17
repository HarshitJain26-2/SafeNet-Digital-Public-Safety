"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion"

export function FinalCTA() {
  return (
    <section id="cta" className="relative py-20 lg:py-24">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,212,255,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-3xl rounded-2xl border border-shield-cyan/15 bg-shield-navy-light/50 px-6 py-16 text-center shadow-2xl shadow-shield-cyan/5 sm:px-12 sm:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Move from Reactive Response to{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Proactive Protection.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-shield-muted">
              Explore how ShieldAI connects citizens, financial institutions, and investigators
              through explainable, multi-modal public-safety intelligence.
            </p>

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
                <Link href="#platform">Explore Intelligence Modules</Link>
              </Button>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-shield-cyan/40">
              Detect &bull; Prevent &bull; Protect
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
