import React from "react";
import { motion, type MotionProps } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * FadeIn
 * A minimal fade + slight translateY animation wrapper.
 * Use to gently reveal content when it mounts.
 */
export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Y offset for initial position (pixels) */
  y?: number;
  /** Motion override props when you need full control */
  motionProps?: MotionProps;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

// PUBLIC_INTERFACE
export function FadeIn({
  delay = 0,
  y = 6,
  motionProps,
  as: Comp = "div",
  className,
  children,
  ...rest
}: FadeInProps) {
  const base: MotionProps = {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y },
    transition: { duration: 0.22, ease: "easeOut", delay },
  };

  const MotionComp = (motion as Record<string, unknown>)[Comp as keyof typeof motion] as unknown || motion.div;

  return (
    <MotionComp {...base} {...motionProps} className={className} {...rest}>
      {children}
    </MotionComp>
  );
}

export default FadeIn;
