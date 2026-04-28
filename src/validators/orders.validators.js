import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.uuid('productId must be a valid UUID'),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1, 'Order must include at least one item'),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'PLACED', 'PAID', 'CANCELLED']),
  }),
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  query: z.any().optional(),
});

export const orderIdParamSchema = z.object({
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  body: z.any().optional(),
  query: z.any().optional(),
});
