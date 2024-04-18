import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './DescribeBusinessPage.css'; // Make sure the CSS file is named 'CollageCreator.css'
import { useNavigate } from 'react-router-dom';
import myImage from './images/cube.png';
const CollageCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [objects, setObjects] = useState([]);
  const [images, setImages] = useState({});
  const [collage, setCollage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState({})
  const [added, setAdded] = useState(new Map());
  const [dynamicText, setDynamicText] = useState('Businesses');
  const [purpose, setPurpose] = useState('');
  const [activeSelections, setActiveSelections] = useState({
    mood: '',
    style: '',
    colorScheme: '',
    theme: '',
    type: '',
  });
  const [selections, setSelections] = useState({
  
    style: '',
    mood: '',
    colorScheme: '',
    theme: ''
  });
  
  const navigate = useNavigate();
 
  
  const handleSelection = (type, value) => {
    setActiveSelections(prev => ({ ...prev, [type]: value }));
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDynamicText(prevText => prevText === ' Businesses' ? ' Personal Use' : ' Businesses');
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(intervalId);
  }, []);
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handlePurposeSelect = (value) => {
    setPurpose(value);
    setSelections({ style: '', mood: '', colorScheme: '', theme: '' }); // Reset selections when purpose changes
    
  };

  const handleSubmitPrompt = async () => {
   
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8080/classify-text', { text: prompt,
     ...selections });
      console.log('Received data:', response.data); 
      
      const objectList = response.data.result
      .split('\n') 
      .map(line => {
        const [objectName] = line.split(':'); 
        return objectName.trim(); 
      })
      .filter(Boolean); 
      console.log('Parsed objects:', objectList);
      setObjects(objectList);
    
    } catch (error) {
      console.error('Error in text classification:', error);
    } finally {
      setLoading(false);
    }
  };
  const styleOptions = ['Realistic', 'Anime', 'Cartoonistic', 'Painting'];
  const moodOptions = ['Happy', 'Serious', 'Adventurous', 'Relaxed'];
  const colorSchemeOptions = ['Vibrant', 'Monochrome', 'Pastel', 'Dark'];
  const themeOptions = ['Modern', 'Professional', 'Classic', 'Eccentric'];
  const typeOptions = ['Business Card', 'Logo', 'Poster', 'Brochure'];
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
        [objectName]: imageResponses.map((res, index) => ({
          id: `${objectName}-${index}`,
          src: `data:image/jpeg;base64,${res.data.photo}`,
          added: false,
        }))
      }));
    } catch (error) {
      console.error('Error generating images for object:', objectName, error);
    } finally {
      setGenerating(prev => ({ ...prev, [objectName]: false })); 
      setLoading(false)// Reset generating status for the object
    }
  };
  const handleAddToCollage = (imageId, objectName) => {
    const objectImages = images[objectName];
    const imageIndex = objectImages.findIndex(img => img.id === imageId);
    if (imageIndex > -1 && !objectImages[imageIndex].added) {
      setCollage(prevCollage => [...prevCollage, objectImages[imageIndex]]);
      // Set the added flag to true for that specific image
      const updatedImages = {
        ...images,
        [objectName]: [
          ...objectImages.slice(0, imageIndex),
          { ...objectImages[imageIndex], added: true },
          ...objectImages.slice(imageIndex + 1)
        ]
      };
      setImages(updatedImages);
    }
  };
  
  // This function is called when the "Open Image Editor" button is clicked
  const openImageEditor = () => {
    // Navigate to the image editor route with the images in the collage
    navigate('/image-editor', { state: { images: collage } });
  };

  const handleRemoveFromCollage = (objectName) => {
    setCollage(collage.filter(item => item.name !== objectName));
  };

  return (
    <div className="collage-creator-container">
      <div className="animated-text-container">
        <p className="static-text">
          AI Design Solutions for <span className="dynamic-text">{dynamicText}</span>
        </p>
       
      </div>
      
      <textarea
        className="prompt-textarea"
        onChange={handlePromptChange}
        value={prompt}
        placeholder="Enter short description of what are you looking for..."
        disabled={loading} // Disable while loading
      />
    
    {!purpose && (
      <>
        <button onClick={() => setPurpose('Personal')} className="selection-button">
          Personal
        </button>
        <button onClick={() => setPurpose('Business')} className="selection-button">
          Business
        </button>
      </>
    )}

    {purpose === 'Personal' && (
      <>
        <div className="button-group">
          <p>Mood:</p>
          {moodOptions.map(mood => (
            <button
              key={mood}
              onClick={() => handleSelection('mood', mood)}
              className={activeSelections.mood === mood ? 'selection-button active' : 'selection-button'}
            >
              {mood}
            </button>
          ))}
        </div>
        
        <div className="button-group">
          {/* Style, Color Scheme, Theme buttons for Personal */}
        </div>
      </>
    )}

    {purpose === 'Business' && (
      <>
        <div className="button-group">
          <p>Type:</p>
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => handleSelection('type', type)}
              className={activeSelections.type === type ? 'selection-button active' : 'selection-button'}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="button-group">
          {/* Style, Color Scheme, Theme buttons for Business */}
        </div>
      </>
    )}

    {purpose && (
      <>
        {/* Shared Style, Color Scheme, Theme options */}
        <div className="button-group">
          <p>Style:</p>
          {styleOptions.map(style => (
            <button
              key={style}
              onClick={() => handleSelection('style', style)}
              className={activeSelections.style === style ? 'selection-button active' : 'selection-button'}
            >
              {style}
            </button>
          ))}
        </div>

        <div className="button-group">
          <p>Color Scheme:</p>
          {colorSchemeOptions.map(colorScheme => (
            <button
              key={colorScheme}
              onClick={() => handleSelection('colorScheme', colorScheme)}
              className={activeSelections.colorScheme === colorScheme ? 'selection-button active' : 'selection-button'}
            >
              {colorScheme}
            </button>
          ))}
        </div>

        <div className="button-group">
          <p>Theme:</p>
          {themeOptions.map(theme => (
            <button
              key={theme}
              onClick={() => handleSelection('theme', theme)}
              className={activeSelections.theme === theme ? 'selection-button active' : 'selection-button'}
            >
              {theme}
            </button>
          ))}
        </div>
      </>
    )}

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
              
{images[objectName] && images[objectName].map((image) => (
  <div className="image-preview" key={image.id}>
    <img src={image.src} alt={`${objectName}`} />
    <button 
      onClick={() => handleAddToCollage(image.id, objectName)}
      disabled={image.added} // Disable button based on the specific image's added flag
    >
      {image.added ? 'Added' : 'Add to Layer Panel'}
    </button>
  </div>
  ))
}
          
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
      {collage.length > 0 && (
        <button className="open-editor-button" onClick={openImageEditor}>
          Open Image Editor
        </button>
      )}
    </div>
  );
};

export default CollageCreator;