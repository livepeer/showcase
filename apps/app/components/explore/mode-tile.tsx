import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Label } from "@repo/design-system/components/ui/label";
import { ExternalLink } from "lucide-react";

export default function ModelTile({
  model,
}: {
  model: {
    title: string;
    description: string;
    image: string;
    pipeline: string;
  };
}) {
  return (
    <Card className="">
      <CardHeader className="p-4 flex justify-between flex-row">
        <CardTitle className="text-lg">{model.title}</CardTitle>
        <Badge>{model.pipeline}</Badge>
      </CardHeader>
      <CardContent className="p-4 py-0">
        <div className="aspect-video mb-4 relative">
          <img
            src={`/ai/${model.image}`}
            className="w-full h-[17rem] object-cover rounded-md"
            alt={model.title}
          />
        </div>
        <Label className="font-normal">{model.description}</Label>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 py-2">
        <ModelSource model={model} />
        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

const ModelSource = ({
  model,
}: {
  model: {
    title: string;
    description: string;
    image: string;
    pipeline: string;
  };
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 rounded-full  ">
        <img
          src={"/ai/livepeer.webp"}
          className="w-full h-full object-cover rounded-full"
          alt={model.title}
        />
      </div>
      <Label className="font-normal">by Livepeer Studio</Label>
    </div>
  );
};
