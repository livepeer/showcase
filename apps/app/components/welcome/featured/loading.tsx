import React from "react";

export default function Loading() {
  return (
    <div className="relative rounded-2xl border p-4 mt-4 h-[calc(100vh-24rem)]">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-6 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-video relative bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
