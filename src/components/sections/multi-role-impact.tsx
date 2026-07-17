"use client"

import { Users, Building2, Shield } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"

const roles = [
  {
    icon: Users,
    title: "Citizens",
    description: "First line of personal digital defense",
    items: [
      "Detect suspicious communications",
      "Understand why content is risky",
      "Receive immediate safety guidance",
      "Generate structured complaint drafts",
    ],
    accent: "border-shield-cyan/20 hover:border-shield-cyan/30",
    iconBg: "bg-shield-cyan/10",
    iconColor: "text-shield-cyan",
  },
  {
    icon: Building2,
    title: "Banks",
    description: "Streamlined preliminary screening",
    items: [
      "Support preliminary currency screening",
      "Review security-feature analysis",
      "Escalate uncertain notes for manual verification",
      "Reduce repetitive inspection effort",
    ],
    accent: "border-shield-blue/20 hover:border-shield-blue/30",
    iconBg: "bg-shield-blue/10",
    iconColor: "text-shield-blue",
  },
  {
    icon: Shield,
    title: "Law Enforcement & Cybercrime Cells",
    description: "Intelligence-led investigation support",
    items: [
      "Analyze connected fraud entities",
      "Identify high-risk accounts",
      "Review investigation timelines",
      "Explore regional crime patterns",
      "Prioritize cases using explainable intelligence",
    ],
    accent: "border-shield-warning/20 hover:border-shield-warning/30",
    iconBg: "bg-shield-warning/10",
    iconColor: "text-shield-warning",
  },
]

export function MultiRoleImpact() {
  return (
    <section id="impact" className="relative py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-shield-cyan/[0.02] to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for Every Layer of{" "}
              <span className="bg-gradient-to-r from-shield-cyan to-shield-blue bg-clip-text text-transparent">
                Digital Public Safety
              </span>
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-6 lg:grid-cols-3" delay={0.2}>
          {roles.map((role) => (
            <StaggerItem key={role.title}>
              <div
                className={`group h-full rounded-xl border bg-shield-navy-light/50 p-6 transition-all duration-300 hover:bg-shield-navy-light/80 hover:shadow-lg hover:shadow-shield-cyan/5 sm:p-8 ${role.accent}`}
              >
                <div className={`mb-5 inline-flex rounded-lg ${role.iconBg} p-3`}>
                  <role.icon className={`h-6 w-6 ${role.iconColor}`} />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-white">{role.title}</h3>
                <p className="mb-5 text-sm text-shield-muted/60">{role.description}</p>
                <ul className="space-y-3">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-shield-cyan/40" />
                      <span className="text-sm text-shield-muted">{item}</span>
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
