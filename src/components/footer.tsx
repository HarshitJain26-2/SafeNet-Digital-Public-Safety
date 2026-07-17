"use client"

import Link from "next/link"
import { ShieldAILogo } from "@/components/shield-logo"

const navLinks = [
  { name: "Platform", href: "/#platform" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Intelligence Engine", href: "/#intelligence-engine" },
  { name: "Architecture", href: "/#architecture" },
  { name: "Impact", href: "/#impact" },
]

const productModules = [
  { name: "Fraud Shield", href: "/citizen" },
  { name: "Currency Verification", href: "/currency" },
  { name: "Fraud Investigation", href: "/network" },
  { name: "Crime Intelligence", href: "/#platform" },
]

export function Footer() {
  return (
    <footer className="border-t border-shield-cyan/10 bg-shield-navy-light/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <ShieldAILogo />
            <p className="mt-3 text-sm text-shield-muted/60">
              AI Powered Digital Public Safety Intelligence Platform
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-shield-muted/40">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-shield-muted/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-shield-muted/40">
              Product Modules
            </h3>
            <ul className="mt-4 space-y-2.5">
              {productModules.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-shield-muted/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-shield-muted/40">
              About
            </h3>
            <p className="mt-4 text-sm text-shield-muted/50">
              Hackathon prototype for AI-powered digital public-safety innovation.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-shield-cyan/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-shield-muted/40">
              ShieldAI — Hackathon Prototype
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shield-cyan/30">
              Detect &bull; Prevent &bull; Protect
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
