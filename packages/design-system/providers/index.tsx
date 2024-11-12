import { GoogleAnalytics } from "@repo/analytics/google";
import { VercelAnalytics } from "@repo/analytics/vercel";
import { env } from "@repo/env";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { PrivyProvider } from "./privy";
import { ThemeProvider } from "./theme";
// @ts-ignore
import { VercelToolbar } from "@vercel/toolbar/next";

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <PrivyProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </PrivyProvider>
    <Toaster />
    <VercelAnalytics />
    <VercelToolbar />
    {env.NODE_ENV !== "development" && (
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    )}
  </ThemeProvider>
);
