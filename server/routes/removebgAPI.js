// cloudinaryRemoveBgRoute.js (Server Side)
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

router.post('/', async (req, res) => {
  const { image } = req.body;

  try {
    // Use the Cloudinary API for removing the background
    const result = await cloudinary.uploader.upload(image, {
      transformation: [
        {
          effect: "remove_background"
        },
        // Add any other transformations here
      ],
      // Other Cloudinary options if needed
    });

    // Send the URL of the processed image back to the client
    res.send({ url: result.secure_url });
  } catch (error) {
    console.error('Error with Cloudinary API:', error);
    res.status(500).send({ message: 'Error processing image with Cloudinary' });
  }
});

export default router;
