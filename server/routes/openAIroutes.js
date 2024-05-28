import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from OpenAI API!' });
});

router.route('/').post(async (req, res) => {
  try {
    
    const promptText = `
    Analyze the given description: "${req.body.text}". 
    1)strictly, return the "${req.body.text}" exactly as it is given by user
   2) Strictly, List all unique and relevant business elements mentioned by their exact name in seperate bullet points 
    , excluding generic design terms like 'logo' or 'Poster'.
  3)Strictly adhere to 1) and 2) and don't return anything except for what is explicitly asked above.
   don't return empty items
    `;
    
  
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct", 
      prompt: promptText,
      max_tokens: 100,
    });

    res.status(200).json({ result: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;
