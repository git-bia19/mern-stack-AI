import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const messages = [
      { role: "system", content: "Identify objects and describe them separately." },
      { role: "user", content: text }
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 100
    });
    const result = response.data.choices[0].message.content.trim();
    res.status(200).json({ result: result });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
