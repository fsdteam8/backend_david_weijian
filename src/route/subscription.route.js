import express from 'express';
import { createSubscription, getAllSubscriptions, getSubscription, updateSubscription, deleteSubscription } from '../controller/subscription.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/create-subscription', verifyJWT, createSubscription);
router.get('/', verifyJWT, getAllSubscriptions);
router.get('/:id', verifyJWT, getSubscription);
router.patch('/update/:id',verifyJWT, updateSubscription);
router.delete('/delete/:id',verifyJWT, deleteSubscription);

export default router;
