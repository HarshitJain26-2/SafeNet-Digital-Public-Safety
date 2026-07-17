"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  children: React.ReactNode
}

export function FadeIn({
  delay = 0,
  direction = "up",
  className,
  children,
  ...props
}: FadeInProps) {
  const offsets = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
    none: {},
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
