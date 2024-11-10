import Billing from "@/components/billing";
import Header from "@/components/header/index";
import Models from "@/components/models";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { Metadata } from "next";
import type { ReactElement } from "react";

const title = "Acme Inc";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async (): Promise<ReactElement> => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 w-screen border-b border-border">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Header />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <h1>Hello</h1>
        </div>
      </div>
      <Models />
    </>
  );
};

export default App;
