import PipelineTile from "./tile";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const pipelines = [
  {
    id: "livepotrait",
    title: "Live Portrait",
    description:
      "A real-time video to video model that can generate videos from text prompts.",
    pipeline: "Video to Video",
    image: "liveportrait.gif",
    huggingFaceId: "",
    docs: "https://docs.livepeer.org/api-reference/generate/video-to-video",
    isComfyUI: true,
    isFeatured: true,
  },
];

export default function FeaturedPipelines() {
  const featuredPipelines = pipelines.filter((pipeline) => pipeline.isFeatured);
  return (
    <div className="relative rounded-2xl border p-4 mt-4 h-[calc(100vh-24rem)]">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">Featured Pipelines</h3>
          <p className="text-muted-foreground text-sm w-full">
            Here are some of our hand-picked pipelines, curated to help you get
            started with Livepeer AI pipelines.
          </p>
        </div>
        <div>
          <Link
            href={"/explore"}
            className="text-sm gap-1 flex items-center -ml-20 -mt-8 md:-ml-0 md:-mt-0"
          >
            View All
            <ArrowTopRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-6 mt-4">
        {featuredPipelines.map((pipeline, index) => (
          <PipelineTile
            key={index}
            id={pipeline.id}
            title={pipeline.title}
            description={pipeline.description}
            image={`/images/${pipeline.image}`}
            isComfyUI={pipeline.isComfyUI || false}
            author="Suhail"
          />
        ))}
      </div>
    </div>
  );
}
