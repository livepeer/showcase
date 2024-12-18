import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Winner, getYesterdaysWinners } from "../../../config/winners";

export const pipelines = [
  {
    id: "pip_fPJPE3QdSw2SrF6W",
    title: "Live Portrait",
    description:
      "A real-time video to video model that can generate videos from text prompts.",
    image: "liveportrait.gif",
    huggingFaceId: "",
    docs: "https://docs.livepeer.org/api-reference/generate/video-to-video",
    isComfyUI: false,
    isFeatured: true,
  },
  {
    id: "pip_p4XsqEJk2ZqqWLuw",
    title: "Stream Diffusion",
    description:
      "A real-time video to video model that can generate videos from text prompts.",
    image: "StreamDiffusion.jpg",
    huggingFaceId: "",
    docs: "https://docs.livepeer.org/api-reference/generate/video-to-video",
    isComfyUI: false,
    isFeatured: true,
  },
  {
    id: "pip_p4XsqEJk2ZqqWLuw",
    title: "Depth Anything",
    description:
      "A highly practical solution for robust monocular depth estimation.",
    image: "depth-anything.png",
    huggingFaceId: "",
    docs: "https://docs.livepeer.org/api-reference/generate/video-to-video",
    isComfyUI: false,
    isFeatured: true,
  }
];

export default function Winners(): JSX.Element {
  const winners = getYesterdaysWinners();

  return (
    <div className="relative border p-4 mt-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">Yesterday's Highlights</h3>
          <p className="text-muted-foreground text-sm w-full">
            Check out yesterday's prompt challenge winners.
          </p>
        </div>
        <div>
          <Link
            href={"https://discord.gg/livepeer"}
            target="_blank"
            className="text-sm gap-1 flex items-center -ml-20 -mt-8 md:-ml-0 md:-mt-0"
          >
            Join Today's Challenge on Discord
            <ArrowTopRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-3">
        {winners.map((winner) => (
          <div key={`${winner.winningDate}-${winner.rank}`} className="aspect-video relative">
            <iframe
              src={`https://lvpr.tv/?v=${winner.playbackId}`}
              className="w-full h-full"
            />
            <div className="absolute top-2 right-2 z-10 overflow-auto">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 overflow-hidden rounded-full bg-white px-2 py-0.5 text-black text-xs">
                  {winner.discordHandle}
                </div>
                <div className="flex items-center gap-1 overflow-hidden rounded-full bg-white px-2 py-0.5 text-black text-xs">
                  Rank #{winner.rank}
                </div>
                <div className="flex items-center gap-1 overflow-hidden rounded-full bg-white px-2 py-0.5 text-black text-xs">
                  {winner.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
