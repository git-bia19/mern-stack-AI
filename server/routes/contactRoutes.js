// contactFormRoutes.js
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Schema and model could also be moved to a separate file (e.g., models/Contact.js)
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Contact form submitted successfully!", data: newContact });
  } catch (error) {
    res.status(400).json({ message: "Error submitting contact form.", error: error.message });
  }
});

export default router;
