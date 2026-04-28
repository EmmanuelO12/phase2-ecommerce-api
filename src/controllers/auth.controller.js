import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { conflict, unauthorized } from '../utils/errors.js';

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ role: user.role, email: user.email }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn,
  });
}

export async function signup(req, res, next) {
  try {
    const { email, password, role } = req.validated.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(conflict('Email already exists'));
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role ?? 'USER',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(unauthorized('Invalid email or password'));
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return next(unauthorized('Invalid email or password'));
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}
