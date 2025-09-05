import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// PUBLIC_INTERFACE
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

// PUBLIC_INTERFACE
export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AnimatePresence>
    {(props as any)["data-state"] !== "closed" && (
      <SheetPrimitive.Overlay asChild forceMount>
        <motion.div
          ref={ref as unknown as React.Ref<HTMLDivElement>}
          className={cn("fixed inset-0 z-50 bg-black/40", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          {...props}
        />
      </SheetPrimitive.Overlay>
    )}
  </AnimatePresence>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// PUBLIC_INTERFACE
export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "left" | "right" | "top" | "bottom";
  }
>(({ className, children, side = "right", ...props }, ref) => {
  const sideStyles =
    side === "right"
      ? "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l"
      : side === "left"
      ? "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r"
      : side === "top"
      ? "inset-x-0 top-0 w-full border-b"
      : "inset-x-0 bottom-0 w-full border-t";

  const variants =
    side === "right"
      ? { initial: { x: 24 }, animate: { x: 0 }, exit: { x: 24 } }
      : side === "left"
      ? { initial: { x: -24 }, animate: { x: 0 }, exit: { x: -24 } }
      : side === "top"
      ? { initial: { y: -24 }, animate: { y: 0 }, exit: { y: -24 } }
      : { initial: { y: 24 }, animate: { y: 0 }, exit: { y: 24 } };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content asChild forceMount {...props}>
        <motion.div
          ref={ref as unknown as React.Ref<HTMLDivElement>}
          className={cn(
            "fixed z-50 gap-4 bg-background p-6 shadow-lg",
            sideStyles,
            className
          )}
          initial={{ opacity: 0, ...(variants as any).initial }}
          animate={{ opacity: 1, ...(variants as any).animate }}
          exit={{ opacity: 0, ...(variants as any).exit }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;
