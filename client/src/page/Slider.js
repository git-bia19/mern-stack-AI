// Slider.js
import React from 'react';
import './Slider.css';

const Slider = ({ min, max, value, type, onChange, label }) => {
  return (
    <div className="slider-container">
      <label>{label}: {value}</label>
      <input
        className="slider"
        min={min}
        max={max}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Slider;
