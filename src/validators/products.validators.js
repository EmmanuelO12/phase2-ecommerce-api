import { z } from 'zod';

const productBody = {
  name: z.string().min(2).max(120),
  description: z.string().min(1).max(1000),
  priceCents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
};

export const createProductSchema = z.object({
  body: z.object(productBody),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const updateProductSchema = z.object({
  body: z.object(productBody).partial().refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field is required for update',
  }),
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  query: z.any().optional(),
});

export const productIdParamSchema = z.object({
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  body: z.any().optional(),
  query: z.any().optional(),
});
