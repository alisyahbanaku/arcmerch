"use client";

import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function VerifiedBadge({ size = "sm", showLabel = false }: VerifiedBadgeProps) {
  const iconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;

  return (
    <span className="inline-flex items-center gap-1" title="Verified Creator — signed in with X">
      <BadgeCheck
        className="text-[#1DA1F2] fill-[#1DA1F2] stroke-black"
        size={iconSize}
        strokeWidth={2}
      />
      {showLabel && (
        <span className="text-[12px] text-[#1DA1F2] font-medium">Verified</span>
      )}
    </span>
  );
}

export function UnverifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] text-white/30 border border-white/10 rounded px-1.5 py-0.5"
      title="Not verified — sign in with X to verify"
    >
      Unverified
    </span>
  );
}
