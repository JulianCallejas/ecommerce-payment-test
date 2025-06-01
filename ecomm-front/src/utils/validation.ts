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

export const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Debe tener al menos 16 dígitos')
    .max(19, 'Debe tener menos de 20 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números (sin espacios)'),
  cvc: z.string()
    .min(3, 'CVC debe ser de 3-4 dígitos')
    .max(4, 'CVC debe ser de 3-4 dígitos')
    .regex(/^\d+$/, 'CVC must contain only digits'),
  expMonth: z.string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Month must be between 01-12'),
  expYear: z.string()
    .regex(/^(0[1-9]|[1-9][0-9])$/, 'El año debe ser de 2 dígitos')
    .refine(val => {
      const year = parseInt(val, 10);
      const currentYear = new Date().getFullYear() - 2000;
      return year >= currentYear && year <= currentYear + 15;
    }, 'Año no es válido'),
  installments: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 cuota')
    .max(60, 'Máximo 60 cuotas'),
  cardHolder: z.string()
    .min(5, 'Debe tener al menos 5 caracteres')
    .regex(/^[A-Za-z\s]+$/, 'Debe contener solo letras y espacios'),
});

export const addressSchema = z.object({
  country: z.string().min(2, 'Pais es requerido'),
  addressLine1: z.string().min(3, 'La dirección es requerida'),
  addressLine2: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      return val.length >= 4;
    },
    {
      message: "Debe tener al menos 4 caracteres si se proporciona",
    }
  ),
  region: z.string().min(2, 'Departamento requerido'),
  city: z.string().min(2, 'Ciudad requerida'),
  postalCode: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      return val.length === 6;
    },
    {
      message: "Debe tener 6 caracteres",
    }
  ),
  contactName: z.string().optional(),
  phoneNumber: z.string()
    .min(10, 'El número de teléfono debe tener al menos 10 caracteres')
    .regex(/^\d+$/, 'Solo se permiten números (sin espacios)'),
});

export const termsSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar los términos y condiciones',
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar la política de uso de datos personales',
  }),
});


export const checkoutSchema = z.object({
  customer: customerSchema,
  paymentData: paymentSchema,
  address: addressSchema,

});

// Type for checkout form data
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
