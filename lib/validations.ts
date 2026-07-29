import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(2),
    company: z.string().optional(),
    phone: z.string().min(8),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });