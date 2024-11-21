"use server";

import { newId } from "@/lib/generate-id";
import { createServerClient } from "@repo/supabase";
import { z } from "zod";

const modelCardSchema = z
  .object({
    baseModel: z.string(),
    modelType: z.string(),
    license: z.string(),
    intendedUse: z.string(),
    trainingDataset: z.string().default("TBD"),
    evaluationResult: z.string().default("TBD"),
  })
  .optional();

const pipelineSchema = z.object({
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  last_used: z.date().nullable().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  is_private: z.boolean().default(true),
  cover_image: z.string().url().nullable().optional(),
  pipeline_type: z.string().default("comfyUI"),
  comfy_ui_json: z.unknown().nullable().optional(),
  sample_code_repo: z.string().url().nullable().optional(),
  is_featured: z.boolean().default(false),
  sample_input_video: z.string().url().nullable().optional(),
  key: z.string(),
  author: z.string(),
  model_card: modelCardSchema,
});

export async function createPipeline(body: any, userId: string) {
  const supabase = await createServerClient();

  const validationResult = pipelineSchema.safeParse({
    ...body,
    author: userId,
  });

  if (!validationResult.success) {
    throw new z.ZodError(validationResult.error.errors);
  }

  const { data, error } = await supabase
    .from("pipelines")
    .insert({
      id: newId("pipeline"),
      ...validationResult.data,
    })
    .select();

  if (error) throw new Error(error.message);
  return data;
}
