"""
ShieldAI Backend — Recommendation Engine

Provides contextual safety recommendations independently of Gemini,
ensuring users always receive robust, structured, and compliant guidance
based on the identified threat category and level.
"""

from __future__ import annotations

from typing import List
from app.schemas.fraud import ScamCategory, ThreatLevel


class RecommendationEngine:
    """Generates standard recommendations based on threat vectors."""

    @staticmethod
    def get_recommendations(category: ScamCategory, level: ThreatLevel) -> List[str]:
        """Return contextual recommendations based on the scam category and level."""
        recs: set[str] = set()

        if level == "Safe" or level == "Safe Communication":
            return [
                "No immediate threat detected.",
                "Always remain vigilant when sharing personal or financial information.",
            ]

        # General high-threat advice
        if level in ("Critical", "High-Risk"):
            recs.add("Do NOT transfer any money or provide payment details.")
            recs.add("Do NOT share OTPs, PINs, or passwords with anyone.")

        # Category-specific advice
        if category == "Digital Arrest Scam" or category == "Government Impersonation":
            recs.add("End this communication immediately.")
            recs.add("Legitimate government agencies will NEVER ask you to transfer funds for 'verification'.")
            recs.add("Do not comply with demands for 'digital arrest' or continuous video surveillance.")
            recs.add("Report this incident to the national cybercrime reporting portal (cybercrime.gov.in) or call 1930.")

        elif category == "Phishing" or category == "Bank Fraud" or category == "OTP Fraud":
            recs.add("Do not click any unverified links in the message.")
            recs.add("Verify your account status directly through your official banking app.")
            recs.add("If you clicked a link or shared details, freeze your bank account immediately.")
            recs.add("Call the Cyber Helpline 1930.")

        elif category == "Investment Fraud":
            recs.add("Stop all investments in the unverified platform immediately.")
            recs.add("Do not pay additional 'withdrawal fees' or 'taxes' to recover your money.")
            recs.add("Report the fraudulent platform to SEBI and local cyber police.")

        elif category == "Fake UPI Request":
            recs.add("Decline the UPI collect request immediately.")
            recs.add("Remember: You only enter your UPI PIN to SEND money, never to RECEIVE money.")
            recs.add("Block the sender on your UPI app.")

        elif category == "Lottery Scam" or category == "Job Scam" or category == "Loan Scam":
            recs.add("Do not pay any upfront processing fees, taxes, or security deposits.")
            recs.add("Stop communicating with the sender and block their number.")

        elif category == "KYC Scam":
            recs.add("Do not download any remote access apps (like AnyDesk or TeamViewer).")
            recs.add("Do not share your PAN, Aadhaar, or bank details.")
            recs.add("Contact your bank's official customer care number directly.")

        # Default fallback
        if not recs:
            recs.add("Block the sender and ignore the communication.")
            recs.add("Report the communication as spam.")

        return list(recs)
