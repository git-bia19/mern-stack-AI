import express from 'express';
import User from '../mongodb/models/user.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully.", user: result });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ message: "Login successful.", user: user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
