import { AttemptedTest } from "../model/attemptedTest.model.js";
import { TestCentre } from "../model/testCentre.model.js";
import { Route } from "../model/routeCentre.model.js";

export const createAttemptedTest = async (req, res) => {
    const { testCentreId, routeId, isCompleted } = req.body;
    const userId = req.user.id;

    try {
        const route = await Route.findById(routeId);
        if (!route) return res.status(404).json({ message: "Route not found" });

        const passRate = route.passRate; // pull from Route

        const newAttempt = new AttemptedTest({
            passRate,
            testCentreId,
            routeId,
            userId,
            isCompleted,
        });

        await newAttempt.save();

        return res.status(201).json({
            status: true,
            message: "Attempted test created successfully",
            data: newAttempt,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const updateTestCentrePassRate = async (req, res) => {
    const { testCentreId } = req.params;

    try {
        // Step 1: Get all completed attempts for this testCentre
        const completedAttempts = await AttemptedTest.find({
            testCentreId,
            isCompleted: true,
        }).select("routeId");

        if (completedAttempts.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No completed attempts found for this testCentre.",
            });
        }

        // Step 2: For each attempt, get the route's passRate
        const routeIds = completedAttempts.map(attempt => attempt.routeId);

        const routes = await Route.find({
            _id: { $in: routeIds },
        }).select("_id passRate");

        // Create a routeId -> passRate map for quick lookup
        const passRateMap = {};
        routes.forEach(route => {
            passRateMap[route._id.toString()] = route.passRate;
        });

        // Step 3: Calculate total passRate and average
        let totalPassRate = 0;

        completedAttempts.forEach(attempt => {
            const routeIdStr = attempt.routeId.toString();
            if (passRateMap[routeIdStr] !== undefined) {
                totalPassRate += passRateMap[routeIdStr];
            }
        });
        
        // Limit to 4 decimal places
        const averagePassRate = Number((totalPassRate / completedAttempts.length).toFixed(2));


        // Step 4: Update TestCentre passRate
        await TestCentre.findByIdAndUpdate(testCentreId, {
            passRate: averagePassRate,
        });

        return res.status(200).json({
            status: true,
            message: "TestCentre passRate updated successfully.",
            averagePassRate,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all attempted tests for a specific route
export const getAttemptedTestByRoute = async (req, res) => {
    const { routeId } = req.params;
    const userId = req.user.id;

    try {
        const attemptedTests = await AttemptedTest.find({
            routeId,
            userId,
        }).populate("routeId", "routeName");

        return res.status(200).json({
            status: true,
            message: "Attempted tests retrieved successfully",
            data: attemptedTests,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a attempted test
export const deleteAttemptedTest = async (req, res) => {
    const { attemptedTestId } = req.params;
    const userId = req.user.id;

    try {
        const deletedAttemptedTest = await AttemptedTest.findByIdAndDelete({
            _id: attemptedTestId,
            userId,
        });

        if (!deletedAttemptedTest) {
            return res.status(404).json({ message: "Attempted test not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Attempted test deleted successfully",
            data: deletedAttemptedTest,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
