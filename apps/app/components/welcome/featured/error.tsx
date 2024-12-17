import React from "react";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="relative rounded-2xl border p-4 mt-4">
      <div className="text-center">
        <h3 className="font-medium text-lg text-red-600">Error Loading Winners</h3>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
    </div>
  );
}
