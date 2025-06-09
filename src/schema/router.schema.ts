import { z } from "zod";

export const router = {
  create: z.object({
    name: z.string().min(1),
    host: z.string().min(1),
    port: z.number(),
    username: z.string().min(1),
    password: z.string().min(1),
  }),
};

export type RouterCreateInput = z.infer<typeof router.create>;
