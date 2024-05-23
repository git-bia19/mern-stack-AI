import express from 'express';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Ready to use GPT-4 API' });
});

router.route('/').post(async (req, res) => {
  try {
    const messages = [
      { role: "system", content: "Strictly list all unique and relevant business elements mentioned by their exact name in separate bullet points, excluding generic design terms like 'logo' or 'poster'. Strictly return the user's words exactly as given." },
      { role: "user", content: req.body.text }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 150,
    });

    // Check if the response data is structured as expected
    if (response && response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      res.status(200).json({ result: response.data.choices[0].message.content.trim() });
    } else {
      // Log the unexpected response structure
      console.error('Unexpected API response structure:', JSON.stringify(response, null, 2));
      res.status(500).json({ error: 'Unexpected API response structure.' });
    }
  } catch (error) {
    console.error('Error with GPT-4 Chat API:', error);
    res.status(500).json({ error: error?.message || 'Something went wrong with the API request.' });
  }
});

export default router;
