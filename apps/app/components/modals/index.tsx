import Billing from "./billing";
import CreatePipeline from "./create-pipeline";
import Gateway from "./gateway";
import HistoryPipelines from "./history";
import LikedPipelines from "./liked-pipeline";
import MyPipelines from "./my-pipelines";

export default function Modals({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tab = searchParams.tab;

  return (
    <>
      <Gateway />
      <Billing />
      {tab && (
        <div
          style={{
            boxShadow: "20px 0px 30px -15px rgba(0, 0, 0, 0.1)",
          }}
          className="fixed left-[16rem] top-[4.4rem] w-[27rem] h-full bg-background border-r border-border overflow-y-auto z-20"
        >
          <CreatePipeline open={tab === "create"} />
          <LikedPipelines open={tab === "liked"} />
          <HistoryPipelines open={tab === "history"} />
          <MyPipelines open={tab === "my"} />
        </div>
      )}
    </>
  );
}
