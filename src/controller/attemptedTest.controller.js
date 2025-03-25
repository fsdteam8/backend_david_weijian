import { AttemptedTest } from "../model/attemptedTest.model.js";

export const createAttemptedTest = async (req, res) => {

    const { passRate, testCentreId, routeId, isCompleted } = req.body
    const userId = req.user.id;

    try {
        const newAttemptedTest = new AttemptedTest({
            passRate,
            testCentreId,
            userId,
            routeId,
            isCompleted
        });

        await newAttemptedTest.save();

        return res.status(201).json({
            status: true,
            message: "Attempted test created successfully",
            data: newAttemptedTest,
        });
    }

    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}