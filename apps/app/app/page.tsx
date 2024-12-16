import Modals from "@/components/modals";
import Welcome from "@/components/welcome";
import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import FeaturedPipelines from "@/components/welcome/featured";
import { validateEnv } from "@/lib/env";

const title = "Livepeer Pipelines ";

export const metadata: Metadata = {
  title,
};

const App = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<ReactElement> => {
  await validateEnv();

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
