import { z } from "zod";

// Zod schemas for form validation
export const customerSchema = z.object({
  fullname: z.string().min(2, "El nombre debe terner al menos 2 caracteres"),
  email: z.string().email("email inválido"),
  personalIdType: z.string().regex(/^(CC|CE|PA)$/, {
    message: "Selecciona un tipo de documento válido (CC, CE or PA)",
  }),
  personalIdNumber: z
    .string()
    .min(5, "Debe temer al menos 5 characters")
    .max(10, "Debe tener máximo 10 characters"),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
});

// Type for checkout form data
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
