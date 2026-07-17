"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  ScanLine,
  Network,
  Map as MapIcon,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShieldAILogo } from "@/components/shield-logo"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Platform", href: "/#platform" },
  { name: "Intelligence Engine", href: "/#intelligence-engine" },
  { name: "Impact", href: "/#impact" },
  { name: "Architecture", href: "/#architecture" },
]

const productModules = [
  {
    name: "AI Citizen Fraud Shield",
    href: "/citizen",
    description: "Analyze suspicious messages, voice, screenshots, and payment requests.",
    icon: ShieldCheck,
  },
  {
    name: "AI Counterfeit Currency Detection & Verification",
    href: "/currency",
    description: "Perform AI-assisted currency security-feature screening.",
    icon: ScanLine,
  },
  {
    name: "AI Fraud Network Analysis & Investigation",
    href: "/network",
    description: "Discover connected entities, fraud clusters, transaction paths, and investigation intelligence.",
    icon: Network,
  },
  {
    name: "Geospatial Crime Intelligence",
    href: "/geospatial",
    description: "Explore cybercrime hotspots, geographic risk patterns, and deployment intelligence.",
    icon: MapIcon,
  },
  {
    name: "Police Investigation & Command Dashboard",
    href: "/command-center",
    description: "Unified AI-assisted intelligence for case prioritization and threat monitoring.",
    icon: LayoutDashboard,
  },
]

export function Navigation() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close menus on escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setDropdownOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-shield-cyan/10 bg-shield-navy/90 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" aria-label="ShieldAI Home" className="relative z-50 shrink-0">
            <ShieldAILogo />
          </Link>

          {/* Center: Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-shield-muted transition-colors hover:text-white focus-visible:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Desktop CTAs & Dropdown */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white",
                  dropdownOpen ? "text-white" : "text-shield-muted"
                )}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Explore Platform 
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", dropdownOpen && "rotate-180")} />
              </button>

              {/* Mega Menu Dropdown */}
              <div 
                className={cn(
                  "absolute right-0 top-[calc(100%+1.5rem)] w-[460px] rounded-xl border border-shield-cyan/20 bg-shield-navy/98 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200 origin-top-right",
                  dropdownOpen 
                    ? "scale-100 opacity-100 pointer-events-auto translate-y-0" 
                    : "scale-95 opacity-0 pointer-events-none -translate-y-2"
                )}
              >
                <div className="grid gap-1">
                  {productModules.map((module) => (
                    <Link
                      key={module.name}
                      href={module.href}
                      onClick={() => setDropdownOpen(false)}
                      className={cn(
                        "group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-shield-cyan/10 focus-visible:bg-shield-cyan/10 focus-visible:outline-none",
                        pathname === module.href ? "bg-shield-cyan/5 border border-shield-cyan/20" : "border border-transparent"
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-shield-cyan/20 bg-shield-navy-light/50 text-shield-cyan transition-colors group-hover:bg-shield-cyan/20 group-hover:text-white">
                        <module.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-shield-cyan">{module.name}</h4>
                        <p className="mt-1 text-xs text-shield-muted leading-relaxed line-clamp-2">{module.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Button asChild size="sm" className="h-9 whitespace-nowrap bg-shield-cyan text-shield-navy transition-all hover:bg-shield-cyan/90">
              <Link href="/citizen">Launch ShieldAI</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 -m-2 rounded-md p-2 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <Menu
              className={cn(
                "h-6 w-6 text-white transition-all duration-200",
                menuOpen && "rotate-180 scale-0 opacity-0"
              )}
            />
            <X
              className={cn(
                "absolute inset-0 m-auto h-6 w-6 text-white transition-all duration-200",
                menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"
              )}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-40 bg-shield-navy/98 backdrop-blur-xl transition-all duration-300 lg:hidden overflow-y-auto custom-scrollbar",
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col px-6 pt-6 pb-24">
            
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">Platform Modules</h3>
              <div className="grid gap-2">
                {productModules.map((module) => (
                  <Link
                    key={module.name}
                    href={module.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-start gap-3 rounded-lg border border-shield-cyan/10 bg-shield-navy-light/30 p-3 transition-colors hover:bg-shield-cyan/10"
                  >
                    <div className="mt-0.5 text-shield-cyan"><module.icon className="h-5 w-5" /></div>
                    <div>
                      <div className="text-sm font-semibold text-white">{module.name}</div>
                      <div className="mt-0.5 text-[11px] text-shield-muted">{module.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-shield-muted">Information</h3>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-4 py-2.5 text-base font-medium text-shield-muted transition-colors hover:bg-shield-cyan/5 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t border-shield-cyan/10 pt-6">
              <Link href="/citizen" onClick={() => setMenuOpen(false)}>
                <Button className="w-full h-12 bg-shield-cyan text-shield-navy hover:bg-shield-cyan/90 text-base font-semibold">
                  Launch ShieldAI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
