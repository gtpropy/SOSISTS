import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number"),
  school: z.string().trim().min(2, "Enter your school name").max(120),
  class: z.enum(["10", "11", "12", "gap"], { message: "Choose your class" }),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});

export const profileSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  guardian_name: z.string().trim().min(2, "Enter a guardian name").max(80),
  guardian_phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter a valid guardian phone number"),
  diet: z.enum(["none", "vegetarian", "vegan", "other"]),
  photo_consent: z.literal("on").optional(),
  guardian_permission: z.literal("on"),
  rules_agreed: z.literal("on"),
});

export const applicationSchema = z.object({
  why_join: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — at least 20 characters")
    .max(1000, "Keep it under 1000 characters"),
});

export const teamCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Team name must be at least 3 characters")
    .max(30, "Team name must be 30 characters or fewer"),
});

export const paymentOnlineSchema = z.object({
  method: z.enum(["esewa", "khalti", "bank"]),
  transaction_id: z.string().trim().min(3, "Enter the transaction ID").max(80),
  payer_phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter the phone number you paid from"),
  pay_for: z.array(z.string()).optional(),
});

/** Normalizes a name for case/space-insensitive comparisons (login, duplicate checks). */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Strips spaces/dashes so "981 234 5678" and "981-234-5678" are the same
 * phone number for login/duplicate-check purposes — phone is now the
 * primary login identifier, so formatting differences can't cause a
 * false mismatch. */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s-]/g, "");
}

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check your input and try again.";
}
