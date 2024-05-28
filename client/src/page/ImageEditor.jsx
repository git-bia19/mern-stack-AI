import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Line, Text, Transformer ,Rect } from 'react-konva';
import useImage from 'use-image';
import './ImageEditor.css';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import SketchPicker from 'react-color';


const ImageEditor = () => {
  const location = useLocation();
  const [images, setImages] = useState(location.state?.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingTextValue, setEditingTextValue] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [drawing, setDrawing] = useState(false);
  const [currentLines, setCurrentLines] = useState([]);
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const [image] = useImage(images[selectedImageIndex]?.src, 'Anonymous');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedForBackground, setSelectedForBackground] = useState(null);
  const [backgroundLayer, setBackgroundLayer] = useState(null);
  const [fontSize, setFontSize] = useState(30);
  const [fontColor, setFontColor] = useState('#000000');
  const fontOptions = ['Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Monospace'];
  const [selectedWidth, setSelectedWidth] = useState(100);
 const [selectedHeight, setSelectedHeight] = useState(100);
 const [crop, setCrop] = useState({ aspect: 16 / 9 });
 const [croppedImageUrl, setCroppedImageUrl] = useState(null);


 
  
  const handleTextStyleChange = useCallback((attribute, value) => {
    setTextItems(currentItems =>
      currentItems.map(item =>
        item.id === editingTextId ? { ...item, [attribute]: value } : item
      )
    );
  }, [editingTextId]);

  useEffect(() => {
    if (isEditingText) {
      handleTextStyleChange('text', editingTextValue);
    }
  }, [editingTextValue, isEditingText, handleTextStyleChange]);

  useEffect(() => {
    handleTextStyleChange('fontFamily', selectedFont);
    handleTextStyleChange('fontSize', fontSize);
    handleTextStyleChange('fill', fontColor);
  }, [selectedFont, fontSize, fontColor, handleTextStyleChange]);


  const handleResize = useCallback(() => {
    const imageNode = stageRef.current.findOne('#imageNode');
    if (imageNode) {
      imageNode.width(selectedWidth);
      imageNode.height(selectedHeight);
      imageNode.getLayer().batchDraw(); // Redraw the layer to apply changes
    }
  }, [selectedWidth, selectedHeight]);
  

const defaultTextStyle = {
  fontFamily: 'Arial',
  fontSize: 30,
  fill: '#000000', // Default text color
};

 
  useEffect(() => {
    const layer = new Konva.Layer();
    stageRef.current.add(layer);
    setBackgroundLayer(layer);
  }, []);

  useEffect(() => {
    setBackground();
  }, [backgroundImage, backgroundColor]);

  const setBackground = useCallback(() => {
    if (!backgroundLayer) return;

    backgroundLayer.removeChildren();
    if (backgroundImage) {
      const imageObj = new Image();
      imageObj.onload = () => {
        const konvaImage = new Konva.Image({
          image: imageObj,
          width: stageRef.current.width(),
          height: stageRef.current.height(),
        });
        backgroundLayer.add(konvaImage);
        backgroundLayer.batchDraw();
      };
      imageObj.src = backgroundImage;
    } else {
      const rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: stageRef.current.width(),
        height: stageRef.current.height(),
        fill: backgroundColor,
      });
      backgroundLayer.add(rect);
      backgroundLayer.batchDraw();
    }
  }, [backgroundImage, backgroundColor, backgroundLayer]);


  

  
  // Ensure the main image layer is always on top
  useEffect(() => {
    if (stageRef.current && backgroundLayer) {
      const imageLayer = stageRef.current.findOne('#imageNode');
      if (imageLayer) {
        imageLayer.moveToTop();
      }
      backgroundLayer.moveToBottom(); // Make sure the background layer stays at the bottom
    }
  }, [backgroundImage, backgroundColor, backgroundLayer]);
  const makeImageMovable = useCallback(() => {
    const mainImage = stageRef.current.findOne('#imageNode');
    if (mainImage) {
      mainImage.draggable(true);
      mainImage.moveToTop(); // Ensures the main image is always on top
      mainImage.getLayer().batchDraw();
    }
  }, []);
    
  const handleSetBackground = useCallback(() => {
    if (selectedForBackground) {
      setBackground();
      makeImageMovable();
    }
  }, [selectedForBackground, setBackground, makeImageMovable]);
  
  const handleSelectForBackground = useCallback((e) => {
    const index = parseInt(e.target.value, 10);
    if (index === selectedImageIndex || index < 0 || index >= images.length) return;
    setBackgroundImage(images[index].src);
    setBackgroundColor('#FFFFFF');
  }, [images, selectedImageIndex]);
 

  const [filterSettings, setFilterSettings] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    saturation: 100,
    hue: 0,
    sepia: 0,
    inversion: 0,
    blur: 0,
  });
  

  const removeBackgroundFromImage = async () => {

    if (!images[selectedImageIndex]) return;
  
    const apiKey = "cqcr6A8ig262gs13h5N9cfhM"; 
    const imageUrl = images[selectedImageIndex].src;
  
    try {
    
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
  
      const formData = new FormData();
      formData.append("image_file", imageBlob, "image.png"); 
  
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey
        },
        body: formData
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`); 
      }
  
      const data = await res.blob();
  
      const newImageSrc = URL.createObjectURL(data);
  
      
      setImages((prevImages) =>
        prevImages.map((img, index) =>
          index === selectedImageIndex ? { ...img, src: newImageSrc } : img
        )
      );
  
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };
  

  
  

  
  useEffect(() => {
    if (selectedNodeId) {
      const selectedNode = stageRef.current.findOne(`#${selectedNodeId}`);
      const transformer = trRef.current;
      transformer.nodes([selectedNode]);
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedNodeId]);
 

  const updateFilterSettings = (setting, value) => {
    setFilterSettings({ ...filterSettings, [setting]: parseInt(value, 10) });
  };
  
  // This effect applies the filters to the canvas.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();
    container.style.filter = `
      brightness(${filterSettings.brightness}%)
      contrast(${filterSettings.contrast}%)
      grayscale(${filterSettings.grayscale}%)
      saturate(${filterSettings.saturation}%)
      hue-rotate(${filterSettings.hue}deg)
      sepia(${filterSettings.sepia}%)
      invert(${filterSettings.inversion}%)
      blur(${filterSettings.blur}px)
    `;
  }, [filterSettings]);
  
   
const toggleDrawing = () => {
  setDrawing(!drawing);
  setCurrentLines([]); // Reset currentLines when starting or stopping drawing
};

// Modifying the mouse event handlers
const handleMouseDown = (e) => {
  // Only start a new line if in drawing mode
  if (!drawing) return;

  const pos = stageRef.current.getPointerPosition();
  setCurrentLines([[pos.x, pos.y]]); // Start a new line with the initial point
};


const handleMouseMove = (e) => {
  // Only add points to the line if in drawing mode and the mouse is down
  if (!drawing || currentLines.length === 0) return;

  const stage = stageRef.current;
  const point = stage.getPointerPosition();
  setCurrentLines((prevLines) => {
    const newLines = [...prevLines];
    newLines[newLines.length - 1].push(point.x, point.y); // Add new point to the current line
    return newLines;
  });
};

const handleMouseUp = () => {
  // Add the current line to the lines array and prepare for a new line
  if (drawing && currentLines.length > 0) {
    setLines((prevLines) => [...prevLines, currentLines[currentLines.length - 1]]);
    setCurrentLines([]); // Optionally reset currentLines here if you want to start fresh on next mouse down
  }
};
const handleDragEnd = (e, layerId) => {
  const index = layers.findIndex(layer => layer.id === layerId);
  const newLayers = [...layers];
  newLayers[index] = {
    ...newLayers[index],
    x: e.target.x(),
    y: e.target.y(),
  };
  setLayers(newLayers);
};

const addToHistory = useCallback(() => {
  const newHistory = [...history, {
    images: [...images],
    textItems: [...textItems],
    lines: [...lines],
    selectedNodeId,
    backgroundImage,
    backgroundColor
  }];
  setHistory(newHistory);
  setCurrentStep(newHistory.length - 1);
}, [history, images, textItems, lines, selectedNodeId, backgroundImage, backgroundColor]);

  // Undo action
  const undo = useCallback(() => {
    if (currentStep > 0) {
      const prevState = history[currentStep - 1];
      setImages(prevState.images);
      setTextItems(prevState.textItems);
      setLines(prevState.lines);
      setSelectedNodeId(prevState.selectedNodeId);
      setBackgroundImage(prevState.backgroundImage);
      setBackgroundColor(prevState.backgroundColor);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, history]);

  // Redo action
  const redo = useCallback(() => {
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      setImages(nextState.images);
      setTextItems(nextState.textItems);
      setLines(nextState.lines);
      setSelectedNodeId(nextState.selectedNodeId);
      setBackgroundImage(nextState.backgroundImage);
      setBackgroundColor(nextState.backgroundColor);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, history]);

 
  const handleSave = useCallback(() => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = 'canvas-image.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  
 

  
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
    setBackgroundImage(null); // Ensure no image is set as background
    setBackground(); // Update the background
  };
  

  const handleBackgroundImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
        setBackgroundColor('#FFFFFF');
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const addText = useCallback(() => {
    const newText = {
      text: 'Type here...',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      fontSize: fontSize,
      fontFamily: selectedFont,
      fill: fontColor,
      id: `text_${Date.now()}`,
      draggable: true
    };
    setTextItems([...textItems, newText]);
    setEditingTextId(newText.id);
    setIsEditingText(true);
    setEditingTextValue(newText.text);
  }, [textItems, fontSize, selectedFont, fontColor]);

  const handleTextClick = (id) => {
    const textItem = textItems.find(item => item.id === id);
    setIsEditingText(true);
    setEditingTextValue(textItem.text);
    setEditingTextId(id);
  };
  const finalizeTextEditing = () => {
  setTextItems(textItems =>
    textItems.map(item =>
      item.id === editingTextId ? { ...item, text: editingTextValue } : item
    )
  );
  setIsEditingText(false);
  setEditingTextId(null);
  addToHistory();
};
const handleTextDragEnd = (e, id) => {
  const newPos = {
    x: e.target.x(),
    y: e.target.y()
  };
  setTextItems(textItems =>
    textItems.map(item => (item.id === id ? { ...item, ...newPos } : item))
  );
  addToHistory();
};


  return (
    <div className="editor-container">
      <div className="sidebar">
     
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setSelectedImageIndex(index)}
            style={{ cursor: 'pointer', width: '100px', margin: '10px', border: selectedImageIndex === index ? '2px solid blue' : '' }}
          />
        ))}
      </div>
     
      <div className="toolbar">
    <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="panel-toggle">
      {isPanelOpen ? " X Layer Panel" : " Layer Panel >"}
    </button>
    {isPanelOpen && (
      <div className="background-panel">
  <SketchPicker color={backgroundColor} onChangeComplete={handleBackgroundColorChange} />
  <input type="file" onChange={handleBackgroundImageUpload} accept="image/*" />
  <select onChange={handleSelectForBackground} value={selectedForBackground || ""}>
    <option value="">Select an Image for Background</option>
    {images.map((img, index) => (
      index !== selectedImageIndex && <option key={index} value={index}>{`Image ${index + 1}`}</option>
    ))}

  </select>
  <button onClick={() => {
    handleSetBackground();
    makeImageMovable();
  }}>Set Background & Move Image</button>
  <button onClick={removeBackgroundFromImage}>Remove Background</button>
</div>
    )}
     <Tooltip title="Add Text" arrow>
        <IconButton onClick={addText}  >
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
      <select onChange={e => setSelectedFont(e.target.value)}>
        {fontOptions.map(font => (
          <option key={font} value={font} alt='Font style'>{font}</option>
        ))}
      </select>
      <label >Font Size</label>
      <input
        type="number"
        value= {fontSize}
        onChange={e => setFontSize(e.target.value)}
        alt='Font Size'

      />
   <label >Font Color</label>
      <input
        type="color"
        value={fontColor}
        onChange={e => setFontColor(e.target.value)}
        alt='font color'

      />
   
      
      <Tooltip title="Zoom In" arrow>
        <IconButton onClick={() => setZoomLevel(zoomLevel * 1.1)}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom Out" arrow>
        <IconButton onClick={() => setZoomLevel(zoomLevel / 1.1)}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Undo" arrow>
        <IconButton onClick={undo}>
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Redo" arrow>
        <IconButton onClick={redo}>
          <RedoIcon />
        </IconButton>
      </Tooltip>
 
    
      
  <Tooltip title="Draw" arrow>
    <IconButton onClick={toggleDrawing}>
      <EditIcon />
    </IconButton>
  </Tooltip>
      
        {isEditingText && (
  <input
    style={{
      position: 'absolute',
      top: `${textItems.find(item => item.id === editingTextId).y}px`,
      left: `${textItems.find(item => item.id === editingTextId).x}px`,
      fontSize: `${textItems.find(item => item.id === editingTextId).fontSize}px`,
      zIndex: 1000, // Ensure the input is above all canvas layers
      background: 'transparent',
      border: 'none',
      outline: 'none',
      width: 'auto',
      color: '#000', // Match text color or make it configurable
    }}
    value={editingTextValue}
    onChange={(e) => setEditingTextValue(e.target.value)}
    onBlur={finalizeTextEditing}
    autoFocus
  />
)}

    
<Tooltip title="Save Image" arrow>
        <IconButton onClick={handleSave}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
 <div className="resize-controls">
  <input
    type="number"
    placeholder="Width (px)"
    value={selectedWidth}
    onChange={e => setSelectedWidth(Number(e.target.value))}
    onFocus={e => e.target.placeholder = ''}
    onBlur={e => e.target.placeholder = 'Width (px)'}
  />
  <input
    type="number"
    placeholder="Height (px)"
    value={selectedHeight}
    onChange={e => setSelectedHeight(Number(e.target.value))}
    onFocus={e => e.target.placeholder = ''}
    onBlur={e => e.target.placeholder = 'Height (px)'}
  />
  <button onClick={handleResize}>Apply Resize</button>
</div>



   
      </div>
 
      <div className="controls">
          <div>
            <label>Brightness</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filterSettings.brightness}
              onChange={(e) => updateFilterSettings('brightness', e.target.value)}
            />
          </div>
          <div>
            <label>Contrast</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filterSettings.contrast}
              onChange={(e) => updateFilterSettings('contrast', e.target.value)}
            />
          </div>
          <div>
    <label>Grayscale</label>
    <input
      type="range"
      min="0"
      max="100"
      value={filterSettings.grayscale}
      onChange={(e) => updateFilterSettings('grayscale', e.target.value)}
    />
  </div>
  <div>
    <label>Saturation</label>
    <input
      type="range"
      min="0"
      max="200"
      value={filterSettings.saturation}
      onChange={(e) => updateFilterSettings('saturation', e.target.value)}
    />
  </div>
  <div>
    <label>Hue Rotation</label>
    <input
      type="range"
      min="0"
      max="360"
      value={filterSettings.hue}
      onChange={(e) => updateFilterSettings('hue', e.target.value)}
    />
  </div>
  <div>
    <label>Sepia</label>
    <input
      type="range"
      min="0"
      max="100"
      value={filterSettings.sepia}
      onChange={(e) => updateFilterSettings('sepia', e.target.value)}
    />
  </div>
  <div>
    <label>Inversion</label>
    <input
      type="range"
      min="0"
      max="100"
      value={filterSettings.inversion}
      onChange={(e) => updateFilterSettings('inversion', e.target.value)}
    />
  </div>
  <div>
    <label>Blur</label>
    <input
      type="range"
      min="0"
      max="10"
      value={filterSettings.blur}
      onChange={(e) => updateFilterSettings('blur', e.target.value)}
    />
  </div>
  <button
  className="reset"
  onClick={() => setFilterSettings({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    saturation: 100,
    hue: 0,
    sepia: 0,
    inversion: 0,
    blur: 0,
  })}
>
  Reset
</button>

            </div>
  

            
      <div className="canvas-container">
        <Stage
          width={window.innerWidth - 300}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          >
          <Layer>
            
          {image && (
            <KonvaImage
              image={image}
              x={20}
              y={20}
              scaleX={zoomLevel}
              scaleY={zoomLevel}
              id="imageNode"
            />
          )}
           </Layer>
  <Layer>
            {lines.map((line, idx) => (
              <Line
                key={idx}
                points={line}
                stroke="black"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
              />
            ))}
           {textItems.map((text, idx) => (
              <Text
              key={idx}
              {...text}
              onClick={() => {
                setEditingTextId(text.id);
                setEditingTextValue(text.text);
                setIsEditingText(true);
              }}
              onDragEnd={(e) => handleTextDragEnd(e, text.id)}
              draggable
            />
            ))}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
      
    </div>
    
    );
    };
    
    export default ImageEditor;
