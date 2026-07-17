"use client"

import {
  Layers,
  Globe,
  Server,
  Shield,
  Brain,
  Eye,
  Database,
  Network,
  MapPin,
  Users,
} from "lucide-react"
import { FadeIn } from "@/components/motion"

const archLayers = [
  { icon: Layers, label: "Modular React Frontend" },
  { icon: Shield, label: "Secure API Layer" },
  { icon: Brain, label: "AI Services" },
  { icon: Eye, label: "Client-Side Computer Vision" },
  { icon: Database, label: "Cloud Database" },
  { icon: Network, label: "Graph-Analysis Services" },
  { icon: MapPin, label: "Geospatial Intelligence" },
  { icon: Users, label: "Role-Based Interfaces" },
]

const futureIntegrations = [
  "Cybercrime reporting systems",
  "Banking infrastructure",
  "Telecom fraud-warning systems",
  "Government digital-safety initiatives",
  "Cross-state fraud intelligence sharing",
]

export function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-shield-cyan/[0.02] to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built as a Prototype.{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Designed for Responsible Scale.
              </span>
            </h2>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Architecture layers */}
          <FadeIn delay={0.1} direction="left">
            <div className="rounded-xl border border-shield-cyan/10 bg-shield-navy-light/30 p-6 sm:p-8">
              <h3 className="mb-6 text-lg font-semibold text-white">Scalable Architecture</h3>
              <div className="grid grid-cols-2 gap-3">
                {archLayers.map((layer) => (
                  <div
                    key={layer.label}
                    className="flex items-center gap-2.5 rounded-lg border border-shield-cyan/8 bg-shield-navy/40 px-3 py-2.5"
                  >
                    <layer.icon className="h-4 w-4 shrink-0 text-shield-cyan/50" />
                    <span className="text-xs font-medium text-shield-muted">{layer.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Future integrations */}
          <FadeIn delay={0.2} direction="right">
            <div className="rounded-xl border border-shield-blue/10 bg-shield-navy-light/30 p-6 sm:p-8">
              <h3 className="mb-2 text-lg font-semibold text-white">Future Integration Possibilities</h3>
              <p className="mb-6 text-xs text-shield-warning/60">
                These are planned integration possibilities — not existing connections.
              </p>
              <ul className="space-y-3">
                {futureIntegrations.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Globe className="h-4 w-4 shrink-0 text-shield-blue/50" />
                    <span className="text-sm text-shield-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-shield-warning/15 bg-shield-warning/5 px-3 py-2">
                <Server className="h-4 w-4 text-shield-warning/60" />
                <span className="text-xs text-shield-warning/70">
                  Infrastructure designed to support future national-scale deployment
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
