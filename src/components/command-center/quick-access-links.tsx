"use client"

import Link from "next/link"
import { ShieldCheck, ScanLine, Network, MapIcon, ChevronRight, Zap } from "lucide-react"

export function QuickAccessLinks() {
  const links = [
    {
      title: "Analyze Suspicious Communication",
      module: "Citizen Fraud Shield",
      href: "/citizen",
      icon: ShieldCheck,
      color: "text-shield-cyan"
    },
    {
      title: "Verify Currency Image",
      module: "Currency Verification",
      href: "/currency",
      icon: ScanLine,
      color: "text-amber-400"
    },
    {
      title: "Investigate Fraud Network",
      module: "Fraud Network Analysis",
      href: "/network",
      icon: Network,
      color: "text-purple-400"
    },
    {
      title: "Explore Regional Threats",
      module: "Geospatial Crime Intelligence",
      href: "/geospatial",
      icon: MapIcon,
      color: "text-red-400"
    }
  ]

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-shield-muted flex items-center gap-2">
        <Zap className="h-3.5 w-3.5" /> Quick Access Modules
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-between rounded-lg border border-shield-cyan/15 bg-shield-navy-light/40 p-4 transition-all hover:bg-shield-cyan/5 hover:border-shield-cyan/40"
          >
            <div>
              <div className={`mb-3 inline-flex rounded-md bg-shield-navy p-2 border border-shield-cyan/10 ${link.color}`}>
                <link.icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">{link.title}</h4>
              <p className="mt-1 text-[10px] uppercase font-semibold text-shield-muted">{link.module}</p>
            </div>
            
            <div className="mt-4 flex items-center text-xs font-semibold text-shield-cyan opacity-80 transition-opacity group-hover:opacity-100">
              Open Module <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
