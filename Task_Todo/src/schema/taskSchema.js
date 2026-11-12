import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title no Space")
    .max(50, "Title max keyword 50"),
  description: z
    .string()
    .trim()
    .min(1, "Description no Space")
    .max(150, "Description max keyword 150"),
  status: z.union([z.string(), z.number()]).optional(),
});
