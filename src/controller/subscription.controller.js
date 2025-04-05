import { Subscription } from '../model/subscription.model.js';

// Create a new subscription
export const createSubscription = async (req, res) => {
    const { name, price, month, title } = req.body;

    try {
        const newSubscription = new Subscription({ name, price, month, title });
        await newSubscription.save();
        return res.status(201).json(
            {
                status: true,
                message: 'Subscription created successfully',
                data: newSubscription
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subscription', error });
    }
};

// Get all subscriptions
export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        return res.status(200).json(
            {
                status: true,
                message: 'Subscriptions fetched successfully',
                data: subscriptions
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscriptions', error });
    }
};

// Get a specific subscription
export const getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        return res.status(200).json(
            {
                status: true,
                message: 'Subscription fetched successfully',
                data: subscription
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription', error });
    }
};

// Update a subscription
export const updateSubscription = async (req, res) => {
    const { name, price, month, title, userId, testCentreId } = req.body;

    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { name, price, month, title, userId, testCentreId },
            { new: true }
        );
        return res.status(200).json(
            {
                status: true,
                message: 'Subscription updated successfully',
                data: updatedSubscription
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subscription', error });
    }
};

// Delete a subscription
export const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        return res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subscription', error });
    }
};
