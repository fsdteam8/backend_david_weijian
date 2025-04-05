// controllers/transactionController.js
import {Transaction} from '../model/transaction.model.js';
import {Subscription} from '../model/subscription.model.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
    const { userId, providerName, price, subscriptionId, testCentreId, transactionId } = req.body;

    try {
        // Validate subscription
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            userId,
            providerName: providerName,
            price,
            subscriptionId,
            testCentreId,
            transactionDate: new Date(),
            transactionId,
        });

        await newTransaction.save();
        return res.status(201).json(
            {
                status: true,
                message: 'Transaction created successfully',
                data: newTransaction
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to create transaction', error });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('subscriptionId');
        return res.status(200).json(
            {
                status: true,
                message: 'Transactions fetched successfully',
                data: transactions
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
};