import PipelineTile from "./tile";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const pipelines = [
  {
    id: "RealVisXL_V4.0_Lightning",
    title: "Realistic Vision V4",
    description:
      "A lightning model designed for faster inference while still aiming for photorealism.",
    pipeline: "Text to Image",
    image: "RealVisXL_V4.0_Lightning.png",
    huggingFaceId: "SG161222/RealVisXL_V4.0_Lightning",
    docs: "https://docs.livepeer.org/api-reference/generate/text-to-image",
    lightning: true,
    isComfyUI: true,
    isFeatured: true,
  },
  {
    id: "instruct-pix2pix",
    title: "Instruct Pix2Pix",
    description:
      "A  model that edits images based on human-written instructions.",
    pipeline: "Image to Image",
    image: "instruct-pix2pix.jpg",
    huggingFaceId: "timbrooks/instruct-pix2pix",
    docs: "https://docs.livepeer.org/api-reference/generate/image-to-image",
  },
  {
    id: "stable-video-diffusion-img2vid-xt-1-1",
    title: "Stable Video Diffusion",
    description:
      "An updated version of Stable Video Diffusion Video with improved quality.",
    pipeline: "Image to Video",
    image: "stable-video-diffusion-img2vid-xt-1-1.gif",
    huggingFaceId: "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
    docs: "https://docs.livepeer.org/api-reference/generate/image-to-video",
    isComfyUI: false,
    isFeatured: true,
  },

  {
    id: "stable-diffusion-x4-upscaler",
    title: "Stable Diffusion Upscaler",
    description:
      " A text-guided upscaling diffusion model trained on large LAION images ",
    pipeline: "Upscale Image",
    image: "stable-diffusion-x4-upscaler.png",
    huggingFaceId: "stabilityai/stable-diffusion-x4-upscaler",
    docs: "https://docs.livepeer.org/api-reference/generate/upscale",
    isComfyUI: true,
    isFeatured: true,
  },
  {
    id: "sam2-hiera-large",
    title: "Segment Anything 2",
    description:
      "SAM 2 is a segmentation model that enables precise selection of objects in image",
    pipeline: "Segmentation",
    image: "sam2-hiera-large.png",
    huggingFaceId: "facebook/sam2-hiera-large",
    docs: "https://docs.livepeer.org/api-reference/generate/segment-anything-2",
    isComfyUI: false,
  },
  {
    id: "sam2-hiera-large",
    title: "Segment Anything 2",
    description:
      "SAM 2 is a segmentation model that enables precise selection of objects in image",
    pipeline: "Segmentation",
    image: "sam2-hiera-large.png",
    huggingFaceId: "facebook/sam2-hiera-large",
    docs: "https://docs.livepeer.org/api-reference/generate/segment-anything-2",
    isComfyUI: false,
  },
  {
    id: "instruct-pix2pix",
    title: "Instruct Pix2Pix",
    description:
      "A  model that edits images based on human-written instructions.",
    pipeline: "Image to Image",
    image: "instruct-pix2pix.jpg",
    huggingFaceId: "timbrooks/instruct-pix2pix",
    docs: "https://docs.livepeer.org/api-reference/generate/image-to-image",
    isComfyUI: true,
    isFeatured: true,
  },
  {
    id: "instruct-pix2pix",
    title: "Instruct Pix2Pix",
    description:
      "A  model that edits images based on human-written instructions.",
    pipeline: "Image to Image",
    image: "instruct-pix2pix.jpg",
    huggingFaceId: "timbrooks/instruct-pix2pix",
    docs: "https://docs.livepeer.org/api-reference/generate/image-to-image",
    isComfyUI: true,
    isFeatured: true,
  },
  {
    id: "stable-diffusion-x4-upscaler",
    title: "Stable Diffusion Upscaler",
    description:
      " A text-guided upscaling diffusion model trained on large LAION images ",
    pipeline: "Upscale Image",
    image: "stable-diffusion-x4-upscaler.png",
    huggingFaceId: "stabilityai/stable-diffusion-x4-upscaler",
    docs: "https://docs.livepeer.org/api-reference/generate/upscale",
    isComfyUI: true,
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
