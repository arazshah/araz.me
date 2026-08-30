import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  collaborationType: z.enum(["consulting", "development", "training", "other"]),
  subject: z.string().trim().min(4).max(160),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal("true"),
  website: z.string().max(0),
  locale: z.enum(["fa", "en"]),
});
export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(10).max(128),
});
export const contentSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(500),
  body: z.string().trim().min(10).max(100000),
  locale: z.enum(["fa", "en"]),
  status: z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
});
