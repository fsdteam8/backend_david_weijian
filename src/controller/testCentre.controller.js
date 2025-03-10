import {TestCenter} from "../model/testCentre.model.js"

// Search centre by postal code or name
const searchTestCentres = async (req, res) => {
    const { search } = req.query;
    try {
      const testCenters = await TestCenter.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { postCode: { $regex: search, $options: 'i' } },
        ],
      });

      if (!testCenters) {
        return res.status(404).json({ status: false, message: 'No test centers found' });
      }

      return res.status(200).json({
        status: true,
        message: 'Test centers found',
        data: testCenters,
      });
    } catch (error) {
        console.log("Error while searching test centers", error);
      res.status(500).json({ message: err.message });
    }
  };

export {
    searchTestCentres,
    
}