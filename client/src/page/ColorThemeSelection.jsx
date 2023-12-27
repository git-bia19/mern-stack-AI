import React, { useState } from 'react';
import './ColorThemeSelection.css'; // Make sure to create a corresponding CSS file
import { useNavigate } from 'react-router-dom';
import { useData } from './DataContext';

const ColorThemeSelection = () => {
  const [color, setColor] = useState('');
  const navigate = useNavigate();
  const { updateData } = useData();

  const handleInputChange = (event) => {
    setColor(event.target.value);

  };

  const handleSubmit = () => {
    sessionStorage.setItem('color', color); // Save to sessionStorage
    navigate('/result-page'); // Navigate to the "Describe Your Business" page
     updateData({ color});
  };

  return (
    <div className="color-theme-container">
    <h2>Enter the color theme associated with your business</h2>
    <input
      className="color-input"
      type="text"
      placeholder="Enter the color theme associated with your business"
      value={color}
      onChange={handleInputChange}
    />
    <button className="submit-button" onClick={handleSubmit}>Generate Image</button>
  </div>
);
};

export default ColorThemeSelection;
