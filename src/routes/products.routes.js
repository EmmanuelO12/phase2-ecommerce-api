import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../controllers/products.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from '../validators/products.validators.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', validate(productIdParamSchema), getProductById);
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  validate(createProductSchema),
  createProduct,
);
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  validate(updateProductSchema),
  updateProduct,
);
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  validate(productIdParamSchema),
  deleteProduct,
);

export default router;
