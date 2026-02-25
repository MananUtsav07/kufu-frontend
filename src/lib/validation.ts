import { z } from 'zod'

export const demoLeadSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  businessType: z.string().trim().min(1, 'Business type is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().trim().email('Enter a valid email address'),
  message: z.string().trim().optional(),
})

export const contactLeadSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  message: z.string().trim().optional(),
})

export type DemoLeadFormValues = z.infer<typeof demoLeadSchema>
export type ContactLeadFormValues = z.infer<typeof contactLeadSchema>
