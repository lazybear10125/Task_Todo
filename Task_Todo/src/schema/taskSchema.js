import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  description: z.string().trim().min(1, "Mô tả không được để trống"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
});
