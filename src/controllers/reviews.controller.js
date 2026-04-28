import { prisma } from '../lib/prisma.js';
import { conflict, forbidden, notFound } from '../utils/errors.js';

function ensureReviewAccess(review, user) {
  return user.role === 'ADMIN' || review.userId === user.id;
}

export async function createReview(req, res, next) {
  try {
    const { productId, rating, comment } = req.validated.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return next(notFound('Product not found'));
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating,
        comment,
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    if (error.code === 'P2002') {
      return next(conflict('You already reviewed this product'));
    }
    return next(error);
  }
}

export async function listReviews(req, res, next) {
  try {
    const where = req.query.productId ? { productId: req.query.productId } : {};

    const items = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
}

export async function getReviewById(req, res, next) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.validated.params.id },
    });

    if (!review) {
      return next(notFound('Review not found'));
    }

    return res.status(200).json(review);
  } catch (error) {
    return next(error);
  }
}

export async function updateReview(req, res, next) {
  try {
    const { id } = req.validated.params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Review not found'));
    }

    if (!ensureReviewAccess(existing, req.user)) {
      return next(forbidden('You can only modify your own reviews'));
    }

    const review = await prisma.review.update({
      where: { id },
      data: req.validated.body,
    });

    return res.status(200).json(review);
  } catch (error) {
    return next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const { id } = req.validated.params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Review not found'));
    }

    if (!ensureReviewAccess(existing, req.user)) {
      return next(forbidden('You can only delete your own reviews'));
    }

    await prisma.review.delete({ where: { id } });

    return res.status(200).json({ id, deleted: true });
  } catch (error) {
    return next(error);
  }
}
