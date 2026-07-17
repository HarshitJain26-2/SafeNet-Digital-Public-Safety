"use client"

import { cn } from "@/lib/utils"

export function ShieldAILogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto"
        aria-hidden="true"
      >
        {/* Shield shape */}
        <path
          d="M20 2L4 10V22C4 32.5 11 38 20 42C29 38 36 32.5 36 22V10L20 2Z"
          fill="url(#shield-gradient)"
          stroke="url(#shield-stroke)"
          strokeWidth="1.5"
        />
        {/* Intelligence node network */}
        <circle cx="20" cy="18" r="3" fill="#00d4ff" opacity="0.9" />
        <circle cx="13" cy="24" r="2" fill="#3b82f6" opacity="0.7" />
        <circle cx="27" cy="24" r="2" fill="#3b82f6" opacity="0.7" />
        <circle cx="20" cy="30" r="2" fill="#3b82f6" opacity="0.7" />
        {/* Connection lines */}
        <line x1="20" y1="18" x2="13" y2="24" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="18" x2="27" y2="24" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="18" x2="20" y2="30" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="13" y1="24" x2="20" y2="30" stroke="#3b82f6" strokeWidth="0.8" opacity="0.35" />
        <line x1="27" y1="24" x2="20" y2="30" stroke="#3b82f6" strokeWidth="0.8" opacity="0.35" />
        <defs>
          <linearGradient id="shield-gradient" x1="20" y1="2" x2="20" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d1224" />
            <stop offset="1" stopColor="#0a0e1a" />
          </linearGradient>
          <linearGradient id="shield-stroke" x1="20" y1="2" x2="20" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-semibold tracking-tight text-white">
        Shield<span className="text-shield-cyan">AI</span>
      </span>
    </div>
  )
}
