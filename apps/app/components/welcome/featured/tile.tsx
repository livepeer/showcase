import { Badge } from "@repo/design-system/components/ui/badge";
import { Label } from "@repo/design-system/components/ui/label";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function PipelineTile({
  title,
  description,
  image,
  isComfyUI,
  author,
  id,
  isFeatured = false,
}: {
  title: string;
  description: string;
  image: string;
  isComfyUI: boolean;
  author: string;
  id: string;
  isFeatured?: boolean;
}) {
  return (
    <Link
      href={`/playground/${id}`}
      className={cn(
        "relative min-w-[20rem] cursor-pointer rounded-xl",
        isFeatured ? "h-48" : "h-52"
      )}
    >
      <div className="relative z-10 flex h-full flex-col justify-between overflow-visible p-4">
        <div className="flex h-[2rem] items-center justify-between">
          {isComfyUI ? (
            <Badge className="bg-green-500/90 text-white font-medium text-xs">
              Comfy UI
            </Badge>
          ) : (
            <div>
              <div />
            </div>
          )}

          <div
            className={
              "flex items-center gap-1 overflow-hidden rounded-full bg-white pr-2 py-0.5 text-black text-xs"
            }
          >
            <Image
              src="https://github.com/suhailkakar.png"
              alt="suhail"
              width={100}
              height={100}
              className="h-5 w-5 flex-shrink-0 rounded-full"
            />
            @{author}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-white">{title}</p>
          <Label className="text-gray-300 text-xs">{description}</Label>
        </div>
      </div>
      <Image
        className="absolute top-0 left-0 h-full w-full rounded-[10px] object-cover"
        src={image}
        alt="pipeline"
        width={500}
        height={500}
      />
      <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-b-[10px] bg-gradient-to-t from-black/60 via-black/60 to-transparent" />
    </Link>
  );
}
