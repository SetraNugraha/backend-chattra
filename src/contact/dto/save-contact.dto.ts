import { z } from 'zod';

export const SaveContactSchema = z.object({
  phone: z
    .string({ message: 'Phone should be a number' })
    .min(8, 'Phone should be at least 8 characters')
    .max(8, 'Phone should be at most 8 characters')
    .regex(/^\d+$/, 'Phone should only contain numbers'),
});

export type SaveContactDto = z.infer<typeof SaveContactSchema>;
