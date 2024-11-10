import React from "react";
import { Button } from "@repo/design-system/components/ui/button";

export default function LoggedOut({ text }: { text: string }) {
  return (
    <div className="flex justify-center h-[calc(100vh-15rem)] items-center">
      <Button variant="outline" className="p-5">
        {text}
      </Button>
    </div>
  );
}
