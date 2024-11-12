import Modals from "@/components/modals";
import Header from "@/components/header/index";
import Playground from "@/components/playground";
import Welcome from "@/components/welcome";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";

const title = "Acme Inc";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<ReactElement> => {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex w-screen items-center gap-2 border-border border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Header />
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto px-6 py-4">
        <div className="flex-shrink-0">
          <Suspense>
            <Welcome />
          </Suspense>
        </div>
        <div className="min-h-0 flex-grow">
          <Suspense>
            <Playground />
          </Suspense>
        </div>
      </div>
      <Modals searchParams={searchParams} />
    </div>
  );
};

export default App;
