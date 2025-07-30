import { z } from 'zod';

export const LoginSchema = z.object({
  phone: z
    .string({ message: 'Phone should be a number' })
    .min(8, 'Phone should be at least 8 characters')
    .max(20, 'Phone should be at most 20 characters')
    .regex(/^\d+$/, 'Phone should only contain numbers'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
