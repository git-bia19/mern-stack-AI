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
    Please perform the following tasks based on the input text:
    
    1. Identify all distinct objects mentioned in the text and list them. Generate relevant image to prompt.
    
    
    Input Text:
    ${req.body.text}
    
    Expected Output:
    - A list of all identified objects keeping in mind their unique characteristic.
    
    `;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct", // Adjust the model as needed
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
