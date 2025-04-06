import express from 'express';
import {createTransaction, getAllTransactions} from "../controller/transaction.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new transaction
router.post('/create-transaction', verifyJWT,  createTransaction);
// Get all transactions
router.get('/', verifyJWT, getAllTransactions);

export default router;