"use client";

import React from "react";
import IntercomClient from "@intercom/messenger-js-sdk";

export default function Intercom() {
  const intercomAppId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID!;

  IntercomClient({
    app_id: intercomAppId,
  });

  return null;
}
