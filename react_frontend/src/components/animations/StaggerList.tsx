import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * StaggerList
 * Wrap a list container to stagger-animate its direct children on mount/update.
 * Keeps animations subtle to preserve minimal visual style.
 */
export interface StaggerListProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Seconds between children appearance */
  interval?: number;
  /** Initial translateY offset for children in px */
  y?: number;
  /** Unique key extractor for children (if children are array of ReactElement) */
  getKey?: { (...args: any[]): React.Key };
  children: React.ReactNode;
}

// PUBLIC_INTERFACE
export function StaggerList({
  as: Comp = "div",
  className,
  interval = 0.06,
  y = 6,
  getKey,
  children,
}: StaggerListProps) {
  // Normalize children to array
  const items = React.Children.toArray(children);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: interval, when: "beforeChildren" },
    },
    exit: {
      transition: { staggerChildren: interval / 2, staggerDirection: -1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y, transition: { duration: 0.18, ease: "easeIn" } },
  };

  // Resolve the appropriate motion component for the chosen tag
  const MotionComp =
    (motion as unknown as Record<string, React.ComponentType<any>>)[Comp as unknown as string] ||
    motion.div;

  return (
    <AnimatePresence mode="popLayout">
      <MotionComp
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className={className}
      >
        {items.map((childNode, i) => {
          const key = getKey ? getKey(childNode, i) : (childNode as any)?.key ?? i;
          // touch i to avoid unused lint in certain TS configs
          void i;
          return (
            <motion.div variants={childVariants as any} key={key}>
              {childNode}
            </motion.div>
          );
        })}
      </MotionComp>
    </AnimatePresence>
  );
}

export default StaggerList;
