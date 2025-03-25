import { AttemptedTest } from "../model/attemptedTest.model.js";
import { TestCentre } from "../model/testCentre.model.js";
import { Route } from "../model/routeCentre.model.js";

// Update passRate for TestCentre (Ignoring passRate === 0)
export const calculateAndUpdateAveragePassRateForTestCentre = async (req, res, next) => {
    const { testCentreId } = req.params;

    try {
        const result = await AttemptedTest.aggregate([
            { $match: { testCentreId: testCentreId, passRate: { $gt: 0 } } }, // Ignore passRate == 0
            { $group: { _id: null, averagePassRate: { $avg: "$passRate" } } }
        ]);

        if (result.length > 0) {
            const averagePassRate = result[0].averagePassRate;

            // PATCH -> Only update passRate field
            await TestCentre.findOneAndUpdate(
                { _id: testCentreId },
                { $set: { passRate: averagePassRate } },
                { new: true }
            );

            return res.status(200).json({ status: true, message: "Pass rate updated successfully", averagePassRate });
        } else {
            return res.status(404).json({ status: false, message: "No valid pass rate data found for this TestCentre." });
        }
    } catch (error) {
        next(error);
    }
};

// Update passRate for RouteCentre (Ignoring passRate === 0)
export const calculateAndUpdateAveragePassRateForRouteCentre = async (req, res, next) => {
    const { routeId } = req.params;

    try {
        const result = await AttemptedTest.aggregate([
            { $match: { routeId: routeId, passRate: { $gt: 0 } } }, // Ignore passRate == 0
            { $group: { _id: null, averagePassRate: { $avg: "$passRate" } } }
        ]);

        if (result.length > 0) {
            const averagePassRate = result[0].averagePassRate;

            // PATCH -> Only update passRate field
            await Route.findOneAndUpdate(
                { _id: routeId },
                { $set: { passRate: averagePassRate } },
                { new: true }
            );

            return res.status(200).json({ status: true, message: "Pass rate updated successfully", averagePassRate });
        } else {
            return res.status(404).json({ status: false, message: "No valid pass rate data found for this RouteCentre." });
        }
    } catch (error) {
        next(error);
    }
};
