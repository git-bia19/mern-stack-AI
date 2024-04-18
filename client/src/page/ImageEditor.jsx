import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Line, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import './ImageEditor.css';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

// Import icons from Material-UI Icons
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


const ImageEditor = () => {
  const location = useLocation();
  const [images, setImages] = useState(location.state?.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [textItems, setTextItems] = useState([]);
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
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextValue, setEditingTextValue] = useState('');
  const [editingTextId, setEditingTextId] = useState(null);
  

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
  

  useEffect(() => {
    if (selectedNodeId) {
      const selectedNode = stageRef.current.findOne(`#${selectedNodeId}`);
      const transformer = trRef.current;
      transformer.nodes([selectedNode]);
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedNodeId]);
 
  const addText = useCallback(() => {
    const newText = {
      text: 'New Text',
      x: 50,
      y: 50 + (textItems.length * 20),
      fontSize: 24,
      fontFamily: selectedFont,
      id: `text_${Date.now()}`,
      draggable: true,
    };
    setTextItems(textItems.concat(newText));
    addToHistory();
  }, [textItems, selectedFont]);


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


const addToHistory = useCallback(() => {
  // Use functional updates to ensure we capture the latest state
  setHistory((currentHistory) => {
    const newHistory = currentHistory.slice(0, currentStep + 1);
    newHistory.push({
      lines: [...lines],
      textItems: [...textItems],
      selectedNodeId,
    });
    return newHistory;
  });
  setCurrentStep((step) => step + 1);
}, [lines, textItems, selectedNodeId, currentStep]);

const undo = useCallback(() => {
  if (currentStep > 0) {
    setCurrentStep((step) => step - 1);
    const prevState = history[currentStep - 1];
    setLines(prevState.lines);
    setTextItems(prevState.textItems);
    setSelectedNodeId(prevState.selectedNodeId);
  }
}, [currentStep, history]);

const redo = useCallback(() => {
  if (currentStep < history.length - 1) {
    setCurrentStep((step) => step + 1);
    const nextState = history[currentStep + 1];
    setLines(nextState.lines);
    setTextItems(nextState.textItems);
    setSelectedNodeId(nextState.selectedNodeId);
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

  const handleTextClick = useCallback((id) => {
    const textItem = textItems.find(item => item.id === id);
    if (textItem) {
      setIsEditingText(true);
      setEditingTextValue(textItem.text);
      setEditingTextId(id);
    }
  }, [textItems]);
 

  const finalizeTextEditing = useCallback(() => {
    if (!editingTextId) return;

    const updatedTextItems = textItems.map(item =>
      item.id === editingTextId ? { ...item, text: editingTextValue } : item
    );
    setTextItems(updatedTextItems);
    setIsEditingText(false);
    setEditingTextId(null);
    addToHistory();
  }, [editingTextId, editingTextValue, textItems]);

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
         <Tooltip title="Save Image" arrow>
        <IconButton onClick={handleSave}>
          <SaveIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add Text" arrow>
        <IconButton onClick={addText}>
          <AddCircleOutlineIcon />
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
      
  <Tooltip title="Draw" arrow>
    <IconButton onClick={toggleDrawing}>
      <EditIcon />
    </IconButton>
  </Tooltip>
        <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
        </select>
        {isEditingText && (
        <input
          type="text"
          value={editingTextValue}
          onChange={(e) => setEditingTextValue(e.target.value)}
          onBlur={finalizeTextEditing}
          style={{ position: 'absolute', top: '10px', left: '10px' }} // This is a placeholder, adjust as needed
        />
        
      )}
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
                width={stageRef.current.width()} // Set width to canvas width
                height={stageRef.current.height()} 
                x={20}
                y={20}
                scaleX={zoomLevel}
                scaleY={zoomLevel}
                id="imageNode"
              />
            )}
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
               {textItems.map((item, i) => (
              <Text
              key={i}
              {...item}
              onClick={() => {
              // Select text item
              const selected = textItems.find(text => text.id === item.id);
              if (selected) {
              setSelectedNodeId(selected.id);
              }
              }}
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
