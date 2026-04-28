import { prisma } from '../lib/prisma.js';
import { badRequest, forbidden, notFound } from '../utils/errors.js';

const TAX_RATE = 0.08;

function ensureOrderAccess(order, user) {
  return user.role === 'ADMIN' || order.userId === user.id;
}

export async function createOrder(req, res, next) {
  try {
    const { items } = req.validated.body;

    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      return next(notFound('One or more products were not found'));
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const orderItemsData = items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product.isActive) {
        throw badRequest(`Product ${product.name} is inactive`);
      }

      if (product.stock < item.quantity) {
        throw badRequest(`Insufficient stock for product ${product.name}`);
      }

      const lineTotalCents = item.quantity * product.priceCents;
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        lineTotalCents,
      };
    });

    const subtotalCents = orderItemsData.reduce((acc, item) => acc + item.lineTotalCents, 0);
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + taxCents;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          status: 'PLACED',
          subtotalCents,
          taxCents,
          totalCents,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function listOrders(req, res, next) {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

    const items = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.validated.params.id },
      include: { items: true },
    });

    if (!order) {
      return next(notFound('Order not found'));
    }

    if (!ensureOrderAccess(order, req.user)) {
      return next(forbidden('You can only access your own orders'));
    }

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function updateOrder(req, res, next) {
  try {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Order not found'));
    }

    if (!ensureOrderAccess(existing, req.user)) {
      return next(forbidden('You can only modify your own orders'));
    }

    if (existing.status === 'PAID' && status !== 'PAID') {
      return next(badRequest('Paid orders cannot be changed to another status'));
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.validated.params;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return next(notFound('Order not found'));
    }

    if (!ensureOrderAccess(existing, req.user)) {
      return next(forbidden('You can only delete your own orders'));
    }

    if (existing.status === 'PAID') {
      return next(badRequest('Paid orders cannot be deleted'));
    }

    await prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });

    return res.status(200).json({ id, deleted: true, softDelete: true });
  } catch (error) {
    return next(error);
  }
}
