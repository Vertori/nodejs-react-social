import { z } from "zod";

export interface UserContact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface UserRecipe {
  _id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  cookingTime: number;
}

export const registerSchema = z
  .object({
    email: z.string().email(),
    username: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .max(12, "Username can't be longer than 12 characters!"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords aren't the same!",
    path: ["confirmPassword"],
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
