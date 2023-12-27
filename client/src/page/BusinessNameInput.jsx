import React, { useState } from 'react';
import './BusinessNameInput.css';
import { useNavigate } from 'react-router-dom';
import { useData } from './DataContext';

const BusinessNameInput = () => {
  const [businessName, setBusinessName] = useState('');
  const navigate = useNavigate();
  const { updateData } = useData();

  const handleInputChange = (event) => {
    setBusinessName(event.target.value);
    

  };

  const handleSubmit = () => {
    sessionStorage.setItem('businessName', businessName); // Save to sessionStorage
    navigate('/describe-business'); // Navigate to the "Describe Your Business" page
     updateData({ businessName });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your business name"
        value={businessName}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Get Started</button>
    </div>
  );
};

export default BusinessNameInput;
