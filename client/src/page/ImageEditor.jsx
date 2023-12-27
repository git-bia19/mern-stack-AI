import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import { Image as ImageJS } from 'image-js';

const ImageEditor = () => {
  const [segmentedBackground, setSegmentedBackground] = useState(null);
  const [segmentedObject, setSegmentedObject] = useState(null);
  const [showBackgroundLayer, setShowBackgroundLayer] = useState(true);
  const [showObjectLayer, setShowObjectLayer] = useState(true);
  const location = useLocation();
  const { photo } = location.state || {};

  useEffect(() => {
    if (photo) {
      ImageJS.load(photo).then((image) => {
        // Convert the image to grayscale
        const greyImage = image.grey();
  
        // Apply a threshold to separate the object from the background
        const thresholdValue = 150; // This value may need adjustment
        const mask = greyImage.getThreshold({ threshold: thresholdValue });
  
        // Extract the object using the mask
        const objectImage = greyImage.mask(mask);
        const objectDataURL = objectImage.toDataURL();
        const imageObj1 = new window.Image();
        imageObj1.onload = () => setSegmentedObject(imageObj1);
        imageObj1.src = objectDataURL;
  
        // To invert the mask, we threshold the image with the inverse threshold
        const inverseThresholdValue = 255 - thresholdValue;
        const inverseMask = greyImage.getThreshold({ threshold: inverseThresholdValue });
  
        // Extract the background using the inverse mask
        const backgroundImage = greyImage.mask(inverseMask);
        const backgroundDataURL = backgroundImage.toDataURL();
        const imageObj2 = new window.Image();
        imageObj2.onload = () => setSegmentedBackground(imageObj2);
        imageObj2.src = backgroundDataURL;
      });
    }
  }, [photo]);
  return (
    <div className="editor-container">
      {/* Layer toggle buttons */}
      <button onClick={() => setShowBackgroundLayer(!showBackgroundLayer)}>
        Toggle Background Layer
      </button>
      <button onClick={() => setShowObjectLayer(!showObjectLayer)}>
        Toggle Object Layer
      </button>

      <Stage width={window.innerWidth} height={window.innerHeight}>
        {/* Background Layer */}
        {showBackgroundLayer && (
          <Layer>
            {segmentedBackground && <KonvaImage image={segmentedBackground} />}
          </Layer>
        )}

        {/* Object Layer */}
        {showObjectLayer && (
          <Layer>
            {segmentedObject && <KonvaImage image={segmentedObject} />}
          </Layer>
        )}
      </Stage>
      {/* Other UI elements */}
    </div>
  );
};


export default ImageEditor;
