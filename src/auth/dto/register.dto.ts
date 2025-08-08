import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be more than 3 character ')
    .max(20, 'Username max character is 20'),
  phone: z
    .string({ message: 'Phone should be a number' })
    .min(8, 'Phone should be at least 8 characters')
    .max(8, 'Phone should be at most 20 characters')
    .regex(/^\d+$/, 'Phone should only contain numbers'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
