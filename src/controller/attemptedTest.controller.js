import { AttemptedTest } from "../model/attemptedTest.model.js";
import { TestCentre } from "../model/testCentre.model.js";
import { Route } from "../model/routeCentre.model.js";

export const createAttemptedTest = async (req, res) => {
    const { testCentreId, routeId, isCompleted } = req.body;
    const userId = req.user.id;

    try {
        const route = await Route.findById(routeId);
        if (!route) return res.status(404).json({ message: "Route not found" });

        const passRate = route.passRate; // from predefined passRate of the route

        const newAttemptedTest = new AttemptedTest({
            passRate,
            testCentreId,
            userId,
            routeId,
            isCompleted,
        });

        await newAttemptedTest.save();

        // If attempt is completed, update TestCentre passRate
        if (isCompleted) {
            await updateTestCentrePassRate(testCentreId, userId);
        }

        return res.status(201).json({
            status: true,
            message: "Attempted test created successfully",
            data: newAttemptedTest,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTestCentrePassRate = async (testCentreId, userId) => {
    try {
        const completedAttempts = await AttemptedTest.find({
            testCentreId,
            userId,
            isCompleted: true,
        }).select("routeId");

        const routeIds = completedAttempts.map((attempt) => attempt.routeId);

        if (routeIds.length === 0) return;

        const routes = await Route.find({
            _id: { $in: routeIds }
        }).select("passRate");

        const total = routes.reduce((sum, route) => sum + route.passRate, 0);
        const averagePassRate = total / routes.length;

        await TestCentre.findByIdAndUpdate(
            testCentreId,
            { passRate: averagePassRate },
            { new: true }
        );

        console.log(`Updated TestCentre ${testCentreId} avg passRate: ${averagePassRate}`);
    } catch (error) {
        console.error("Error updating TestCentre pass rate:", error.message);
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
        const deletedAttemptedTest = await AttemptedTest.findOneAndDelete({
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
