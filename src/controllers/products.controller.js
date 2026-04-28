import { prisma } from '../lib/prisma.js';
import { conflict, notFound } from '../utils/errors.js';

export async function createProduct(req, res, next) {
  try {
    const product = await prisma.product.create({ data: req.validated.body });
    return res.status(201).json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return next(conflict('Product name already exists'));
    }
    return next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const includeInactive = req.query.includeInactive === 'true';

    const items = await prisma.product.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.validated.params.id },
    });

    if (!product) {
      return next(notFound('Product not found'));
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.validated.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Product not found'));
    }

    const product = await prisma.product.update({
      where: { id },
      data: req.validated.body,
    });

    return res.status(200).json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return next(conflict('Product name already exists'));
    }
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.validated.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Product not found'));
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return res.status(200).json({ id, deleted: true, softDelete: true });
  } catch (error) {
    return next(error);
  }
}
