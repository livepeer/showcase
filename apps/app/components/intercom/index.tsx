"use client";

import IntercomClient from "@intercom/messenger-js-sdk";
import { intercom } from "@/lib/env";

export default function Intercom() {
  IntercomClient({
    app_id: intercom.appId,
  });

  return null;
}
