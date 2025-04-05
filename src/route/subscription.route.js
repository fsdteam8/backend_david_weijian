import express from 'express';
import { createSubscription, getAllSubscriptions, getSubscription, updateSubscription, deleteSubscription } from '../controller/subscription.controller.js';

const router = express.Router();

router.post('/create-subscription', createSubscription);
router.get('/', getAllSubscriptions);
router.get('/:id', getSubscription);
router.patch('/update/:id', updateSubscription);
router.delete('/delete/:id', deleteSubscription);

export default router;
