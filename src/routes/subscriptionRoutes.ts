import express from 'express';
import { createSubscription, updateSubscription, cancelSubscription, getSubscriptionStatus } from '../controllers/subscriptionController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create', isAuthenticated, createSubscription);
router.put('/update', isAuthenticated, updateSubscription);
router.post('/cancel', isAuthenticated, cancelSubscription);
router.get('/status', isAuthenticated, getSubscriptionStatus);

export default router;