import React, { useState } from 'react';
import './DescribeBusinessPage.css'; 
import { useNavigate } from 'react-router-dom'; 
import { useData } from './DataContext';

const DescribeBusinessPage = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { updateData } = useData();
  // Function to handle the change in the description input
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    // Here you can implement or call a function to fetch keyword suggestions
  };

  // Function to handle the "Next" button click
  const handleNextClick = () => {
    console.log(description);
    updateData({ description });
    navigate('/target-audience');
  };

  return (
    <div className="describe-business-container">
      <h2>Describe your business</h2>
      <p>Describe your business briefly (ideally in 2-3 sentences). What primary product, service, or value do you offer to your customers?</p>
      <input
        type="text"
        placeholder="Enter here"
        value={description}
        onChange={handleDescriptionChange}
      />
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default DescribeBusinessPage;
