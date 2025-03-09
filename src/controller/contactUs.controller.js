import { ContactUs } from "../model/contactUs.model.js"

// contactUs 
export const submitContactUsForm = async (req, res) => {
  try {
    const { name, email, phone, description } = req.body;

    // check user is authenticated
    if (!req.user) {
      return res.status(401).json({status: false, message: 'User not authenticated' });
    }

    // All fields are required
    if (!name || !email || !phone || !description) {
      return res.status(400).json({status: false, message: 'All fields are required' });
    }

    // Create object with logged user id
    const newContactUs = new ContactUs({
      user: req.user._id, 
      name,
      email,
      phone,
      description,
    });
    
    if(!newContactUs){
        return res.status(400).json({status: false, message: 'Failed to create contact us form' });
    }

    await newContactUs.save();

    return res.status(201).json({status: true, message: 'Contact information submitted successfully', data: newContactUs });
  } catch (error) {
    console.log("Error while submitting contact data", error);
    return res.status(500).json({status: false, message: 'Server error', error });
  }
};
