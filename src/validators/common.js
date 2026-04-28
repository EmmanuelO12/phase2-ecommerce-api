import { z } from 'zod';

export const uuidParamSchema = z.object({
  params: z.object({
    id: z.uuid('id must be a valid UUID'),
  }),
  body: z.any().optional(),
  query: z.any().optional(),
});
