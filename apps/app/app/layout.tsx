import "@repo/design-system/styles/globals.css";
import { fonts } from "@repo/design-system/lib/fonts";
import { DesignSystemProvider } from "@repo/design-system/providers";
import type { ReactNode } from "react";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { GlobalSidebar } from "@/components/welcome/sidebar";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <DesignSystemProvider>
        <SidebarProvider>
          <GlobalSidebar>{children}</GlobalSidebar>
        </SidebarProvider>
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
