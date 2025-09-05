import React from "react";

/**
 * PUBLIC_INTERFACE
 * ErrorState
 * Displays a simple error block with message and optional retry action.
 */
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
  className?: string;
  small?: boolean;
}

// PUBLIC_INTERFACE
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the content. Please try again.",
  onRetry,
  action,
  className,
  small = false,
}: ErrorStateProps) {
  const Action = action ?? (onRetry ? (
    <button
      type="button"
      onClick={onRetry}
      className="text-sm text-primary underline underline-offset-4"
      aria-label="Retry loading"
    >
      Retry
    </button>
  ) : null);

  return (
    <div
      className={[
        "rounded-md border",
        small ? "p-3 text-sm" : "p-4 text-sm",
        "text-red-700 border-red-200 bg-red-50",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
      aria-live="assertive"
    >
      <div className="font-medium text-red-800">{title}</div>
      {message ? <div className="mt-0.5 text-red-700">{message}</div> : null}
      {Action ? <div className="mt-2">{Action}</div> : null}
    </div>
  );
}

export default ErrorState;
