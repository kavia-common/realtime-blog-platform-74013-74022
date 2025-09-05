import React from "react";

/**
 * PUBLIC_INTERFACE
 * LoadingSpinner
 * A minimal, theme-aware spinner with optional inline text.
 */
export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional label to display next to the spinner */
  label?: string;
  /** Size in pixels for the spinner circle */
  size?: number;
  /** Thickness of the spinner ring */
  thickness?: number;
  /** Whether to center within a min-height container (for full section loading) */
  center?: boolean;
}

// PUBLIC_INTERFACE
export function LoadingSpinner({
  label,
  size = 18,
  thickness = 2,
  center = false,
  className,
  ...rest
}: LoadingSpinnerProps) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderWidth: thickness,
  };

  return (
    <div
      className={[
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        center ? "min-h-[120px] w-full justify-center" : "",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span
        className="inline-block rounded-full border-t-transparent border-primary animate-spin"
        style={style}
        aria-label={label || "Loading"}
        role="status"
      />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export default LoadingSpinner;
