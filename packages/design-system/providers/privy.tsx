"use client";

import { PrivyProvider as PrivyProviderRaw } from "@privy-io/react-auth";

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => (
  <PrivyProviderRaw appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}>
    {children}
  </PrivyProviderRaw>
);
