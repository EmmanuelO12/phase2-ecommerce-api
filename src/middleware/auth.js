import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export async function authenticateJWT(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(unauthorized('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return next(unauthorized('Invalid token user'));
    }

    req.user = user;
    return next();
  } catch {
    return next(unauthorized('Invalid or expired token'));
  }
}

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(unauthorized());
  }

  if (!roles.includes(req.user.role)) {
    return next(forbidden('Insufficient permissions'));
  }

  return next();
};
