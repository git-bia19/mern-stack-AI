
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignSelect.css';
import { useData } from './DataContext';

const DesignSelection = () => {
  const [designSelect, setDesignSelect] = useState('');
  const navigate = useNavigate();
  const { updateData } = useData();

  const handleNextClick = () => {
    console.log('Selected target audience:', designSelect);
    navigate('/color-theme-selection');
    updateData({ designSelect});
  };

  return (
    <div className="design-selection-container">
      <h2>Please choose a design you want to create</h2>
      <div>
        <label>
          <input
            type="radio"
            name="design"
            value="Logo"
            checked={designSelect === "Logo"}
            onChange={(e) => setDesignSelect(e.target.value)}
          />
          Logo
        </label>
        <label>
          <input
            type="radio"
            value="Business Card"
            checked={designSelect === "Business Card"}
            onChange={(e) => setDesignSelect(e.target.value)}
          />
          Business Card
        </label>
        <label>
          <input
            type="radio"
            value="Poster"
            checked={designSelect === "Poster"}
            onChange={(e) => setDesignSelect(e.target.value)}
          />
          Poster
        </label>
        <label>
          <input
            type="field"
            value="Other"
            checked={designSelect === "Other"}
            onChange={(e) => setDesignSelect(e.target.value)}
          />
          
        </label>
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default DesignSelection;
