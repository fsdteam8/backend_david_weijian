import { AttemptedTest } from "../model/attemptedTest.model.js";

// Controller to calculate the average pass rate for a TestCentre
export const calculateAveragePassRateForTestCentre = async (req, res, next) => {
    const { testCentreId } = req.params;

    try {
        const result = await AttemptedTest.aggregate([
            { $match: { testCentreId: testCentreId } },
            { $group: { _id: null, averagePassRate: { $avg: "$passRate" } } }
        ]);

        if (result.length > 0) {
            return res.status(200).json({ status: true, averagePassRate: result[0].averagePassRate });
        } else {
            return res.status(404).json({ status: false, message: "No attempted tests found for this TestCentre." });
        }
    } catch (error) {
        next(error);
    }
};


