import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShieldAI — AI Powered Digital Public Safety Intelligence Platform",
  description:
    "ShieldAI helps citizens detect digital scams, enables AI-assisted currency verification, and empowers law enforcement to uncover organized fraud networks through explainable intelligence. Detect • Prevent • Protect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
