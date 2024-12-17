import Link from "next/link";
import React from "react";

export default function AlphaBanner() {
  const PRODUCT_BOARD_URL =
    "https://portal.productboard.com/7xxzmv8xwccfdtkvq3akmf4i/tabs/1-under-consideration";

  return (
    <div className="bg-foreground  text-background py-2 flex items-center justify-center mb-2">
      <p className="text-sm text-center">
      ⚠️ Early Access Preview: This is an early version of our real-time video AI platform. 
      You may encounter performance variations or unexpected behavior as we optimize the system. 
      Your feedback is crucial - 
 
        <Link
          href={PRODUCT_BOARD_URL}
          target="_blank"
          className="underline mx-1 underline-offset-2 hover:no-underline"
        >
          please share your experiences with us!
        </Link>
      </p>
    </div>
  );
}
