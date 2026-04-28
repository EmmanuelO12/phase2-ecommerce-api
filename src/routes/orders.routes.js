import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrder,
} from '../controllers/orders.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderSchema,
} from '../validators/orders.validators.js';

const router = Router();

router.use(authenticateJWT);
router.get('/', listOrders);
router.get('/:id', validate(orderIdParamSchema), getOrderById);
router.post('/', validate(createOrderSchema), createOrder);
router.put('/:id', validate(updateOrderSchema), updateOrder);
router.delete('/:id', validate(orderIdParamSchema), deleteOrder);

export default router;
