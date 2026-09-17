"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FlagImage } from "./FlagImage";

interface FlagReelProps {
  countryCode: string;
  direction: "up" | "down";
  className?: string;
}

const SLIDE_VARIANTS = {
  up: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  down: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
} as const;

/**
 * A single flag "slot" that slides its content out and the next one in
 * whenever `countryCode` changes, like a slot-machine reel. Purely
 * presentational — the caller owns which code is current and when it changes.
 */
export const FlagReel: React.FC<FlagReelProps> = ({ countryCode, direction, className }) => {
  const variant = SLIDE_VARIANTS[direction];

  return (
    <div className={cn("relative h-5 w-7 overflow-hidden rounded-[3px]", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={countryCode}
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          <FlagImage countryCode={countryCode} className="h-full w-full rounded-[3px]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
