import Modals from "@/components/modals";
import Header from "@/components/header/index";
import Playground from "@/components/playground";
import Welcome from "@/components/welcome";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import FeaturedPipelines from "@/components/welcome/featured";

const title = "Livepeer Pipelines ";

export const metadata: Metadata = {
  title,
};

const App = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<ReactElement> => {
  return (
    <div>
      <div className="flex-shrink-0">
        <Suspense>
          <Welcome />
        </Suspense>
      </div>
      <div className="min-h-0 flex-grow">
        <Suspense>
          <FeaturedPipelines />
        </Suspense>
      </div>
      <Modals searchParams={searchParams} />
    </div>
  );
};

export default App;
