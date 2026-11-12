import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title no Space")
    .max(20, "Title max keyword 20"),
  description: z
    .string()
    .trim()
    .min(1, "Description no Space")
    .max(50, "Description max keyword 50"),
  status: z.union([z.string(), z.number()]).optional(),
});
