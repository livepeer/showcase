import Header from "@/components/header/index";
import Modals from "@/components/Modals";
import Welcome from "@/components/welcome";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { Metadata } from "next";
import { Suspense, type ReactElement } from "react";

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

      <div className="px-6 py-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex-shrink-0">
          <Suspense>
            <Welcome />
          </Suspense>
        </div>
        <div className="flex-grow min-h-0">
          {/* <Suspense>
              <Playground searchParams={searchParams} />
            </Suspense> */}
        </div>
      </div>
      <Modals />
    </>
  );
};

export default App;
