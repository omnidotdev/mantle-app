import { useCallback, useRef, useState } from "react";

import cn from "@/lib/utils";

import type { ReactNode } from "react";

type VolcanicCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Interactive card with obsidian surface that reveals magma glow on hover.
 * Tracks mouse position for a radial heat effect beneath the surface.
 */
const VolcanicCard = ({ children, className }: VolcanicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGlowPosition({ x, y });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-base-200 bg-white p-8 transition-all duration-400 dark:border-base-800 dark:bg-base-950",
        "hover:border-primary-400/40 hover:shadow-lg hover:shadow-primary-500/10",
        "motion-reduce:transition-none",
        className,
      )}
    >
      {/* Magma glow layer beneath the surface */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, oklch(0.68 0.17 42 / 0.08), transparent 40%)`
            : undefined,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default VolcanicCard;
