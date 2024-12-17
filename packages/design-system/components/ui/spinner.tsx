import * as React from "react";
import { cn } from "../../lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin", className)}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
