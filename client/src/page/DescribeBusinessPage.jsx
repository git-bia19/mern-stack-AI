import React, { useState } from 'react';
import axios from 'axios';
import './DescribeBusinessPage.css'; // Make sure the CSS file is named 'CollageCreator.css'

const CollageCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [objects, setObjects] = useState([]);
  const [images, setImages] = useState({});
  const [collage, setCollage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState({})

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleSubmitPrompt = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8080/classify-text', { text: prompt });
      console.log('Received data:', response.data); // Log the received data
      
      // Assuming the response is a string with each object on a new line
      const objectList = response.data.result
      .split('\n') // Split the string by new lines into an array
      .map(line => {
        const [objectName] = line.split(':'); // Split each line at the colon and take the first part
        return objectName.trim(); // Trim whitespace from the object name
      })
      .filter(Boolean); 
      console.log('Parsed objects:', objectList);
      setObjects(objectList);
    
    } catch (error) {
      console.error('Error in text classification:', error);
    } finally {
      setLoading(false); // End loading
    }
  };
  
  const handleGenerateImageForObject = async (objectName) => {
    setGenerating(prev => ({ ...prev, [objectName]: true })); // Set generating status for the object
    try {
      // Request two images at once
      const prompts = [objectName, objectName].map(name => `Generate an image of a ${name}`);
      const imageResponses = await Promise.all(prompts.map(prompt =>
        axios.post('http://localhost:8080/api/v1/dalle', { prompt })
      ));

      // Update the state with the new image, converting the binary data to a data URL
      setImages(prevImages => ({
        ...prevImages,
        [objectName]: imageResponses.map(res => `data:image/jpeg;base64,${res.data.photo}`)
      }));
    } catch (error) {
      console.error('Error generating images for object:', objectName, error);
    } finally {
      setGenerating(prev => ({ ...prev, [objectName]: false })); 
      setLoading(false)// Reset generating status for the object
    }
  };
  

  const handleAddToCollage = (imageSrc, objectName) => {
    setCollage([...collage, { src: imageSrc, name: objectName }]);
  };

  const handleRemoveFromCollage = (objectName) => {
    setCollage(collage.filter(item => item.name !== objectName));
  };

  return (
    <div className="collage-creator-container">
      <textarea
        className="prompt-textarea"
        onChange={handlePromptChange}
        value={prompt}
        placeholder="Describe the scene..."
        disabled={loading} // Disable while loading
      />
      <button
        className="classify-text-button"
        onClick={handleSubmitPrompt}
        disabled={loading} // Disable while loading
      >
        {loading ? 'Classifying...' : 'Classify Text'}
      </button>
      {/* Show loading state or the list of objects */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="object-list">
       {Array.isArray(objects) && objects.map((objectName) => (
            <div className="object-entry" key={objectName}>
              <p>{objectName}</p>
              <button onClick={() => handleGenerateImageForObject(objectName)} disabled={generating[objectName]}>
          {generating[objectName] ? 'Generating...' : 'Generate Image'}
        </button>
              {/* Only show image and "Add to Collage" button if image is available */}
               {images[objectName] && images[objectName].map((src, index) => (
                <div className="image-preview" key={index}>
                <img src={src} alt={`${objectName} ${index + 1}`} />
                <button onClick={() => handleAddToCollage(src, objectName)}>
              Add to Layer Panel
            </button>
                </div>
                
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Collage area */}
      <div className="collage-area">
        {/* Map through collage array to render images */}
    
        {collage.map((item, index) => (
          
          <div key={index} className="collage-item">
            
            <img src={item.src} alt={item.name} />
            <button onClick={() => handleRemoveFromCollage(item.name)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollageCreator;
