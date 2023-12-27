

import React, { createContext, useState, useContext } from 'react';

// Create the context
const DataContext = createContext(null);

// Create a custom hook for easy access to the DataContext
export const useData = () => useContext(DataContext);

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    businessName: '',
    description: '',
    targetAudience: '',
    colorTheme: '',
  });

  const updateData = (newData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
