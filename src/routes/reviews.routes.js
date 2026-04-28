import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getReviewById,
  listReviews,
  updateReview,
} from '../controllers/reviews.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createReviewSchema,
  reviewIdParamSchema,
  updateReviewSchema,
} from '../validators/reviews.validators.js';

const router = Router();

router.get('/', listReviews);
router.get('/:id', validate(reviewIdParamSchema), getReviewById);
router.post('/', authenticateJWT, validate(createReviewSchema), createReview);
router.put('/:id', authenticateJWT, validate(updateReviewSchema), updateReview);
router.delete('/:id', authenticateJWT, validate(reviewIdParamSchema), deleteReview);

export default router;
