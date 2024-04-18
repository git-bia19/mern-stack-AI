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
    Please identify all distinct objects, entities, places, or proper nouns
     mentioned in the original verbatim text given by user along with associated adjectives.
     These nouns should be directly relevant to generating images. 
     Also, include a separate entry that repeats the original verbatim text
     word to word exactly as provided by the user in "${req.body.text}".


${req.body.style ? `Desired Style: ${req.body.style}.` : ""}
${req.body.purpose ? `Intended Purpose: ${req.body.purpose}.` : ""}
${req.body.colorScheme ? `Color Scheme Preference: ${req.body.colorScheme}.` : ""}
${req.body.mood ? `Mood Tone: ${req.body.mood}.` : ""}
${req.body.theme ? `Thematic Direction: ${req.body.theme}.` : ""}

Instructions:
1. Extract and list all distinct nouns mentioned in the input text along with its descriptives adjectives or qualities. 
2. Present the exact original input verbatim text as a separate entry, maintaining the user's wording and phrasing.
3. Ensure that the image generation reflects the provided specifications regarding style, purpose, color scheme, 
mood, and theme.
4. The text in the generated images should be clear and accurate, especially for logos and any text features, 
ensuring correct spellings and recognizable facial features where applicable.
Constraints:
- Focus only on the information provided by the user. Do not add or infer any additional details.
- If the user specifies a style (like realistic or anime), the generated image should strictly adhere to this style.
- If no style is specified, default to a realistic representation.
- The image should not include any elements that are not explicitly mentioned in the user's text.
- Do not repeat any instructions give to you in the result
Expected Output:
-Return different nouns or objects mentioned as seperate elements or objects, identified in the user input. 
-Focus by repeating quote and quote user original verbatim input text in "${req.body.text}".
-Generated images that accurately embody the listed nouns and adhere to the user-provided
 specifications such as style, mood, color scheme, and theme.

 Note: Strictly follow instructions and please do not list any styles,
  purpose, color scheme, mood or theme. Please do not generate any AI labels or any objects or 
  elements not mentioned in the user original verbatim quote
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
