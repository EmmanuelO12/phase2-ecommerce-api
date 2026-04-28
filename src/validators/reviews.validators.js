import { z } from 'zod';

const reviewBody = {
  productId: z.uuid('productId must be a valid UUID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
};

export const createReviewSchema = z.object({
  body: z.object(reviewBody),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const updateReviewSchema = z.object({
  body: z
    .object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().min(1).max(1000).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
      message: 'At least one field is required for update',
    }),
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  query: z.any().optional(),
});

export const reviewIdParamSchema = z.object({
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  body: z.any().optional(),
  query: z.any().optional(),
});
