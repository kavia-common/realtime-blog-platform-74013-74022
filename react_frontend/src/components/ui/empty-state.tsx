import React from "react";

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * Minimal empty placeholder with a title, description, and optional action.
 */
export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

// PUBLIC_INTERFACE
export function EmptyState({
  title = "Nothing here yet",
  description = "There is no content to display.",
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-md border p-6 text-center",
        "text-sm text-muted-foreground",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon ?? <span className="text-lg">⌁</span>}
      </div>
      <div className="mb-1 text-base font-medium text-foreground/90">{title}</div>
      <div className="mx-auto max-w-prose">{description}</div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
