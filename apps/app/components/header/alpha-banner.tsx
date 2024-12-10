import Link from "next/link";
import React from "react";

export default function AlphaBanner() {
  const PRODUCT_BOARD_URL =
    "https://portal.productboard.com/7xxzmv8xwccfdtkvq3akmf4i/tabs/1-under-consideration";

  return (
    <div className="bg-foreground  text-background py-2 flex items-center justify-center mb-2">
      <p className="text-sm text-center">
        ⚠️ This product is an early preview of real-time live video AI. It is
        under active development and you may experience bugs or other strange
        behavior. If something doesn&apos;t behave how you expect,
        <Link
          href={PRODUCT_BOARD_URL}
          target="_blank"
          className="underline mx-1 underline-offset-2 hover:no-underline"
        >
          please reach out
        </Link>
        - we want to hear from you!
      </p>
    </div>
  );
}
