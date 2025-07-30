import { z } from 'zod';

export const SendMessageSchema = z.object({
  body: z
    .string()
    .min(1, 'Body cannot be empty')
    .max(500, 'message to long, maximun 500 character'),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;
