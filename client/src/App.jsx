import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './page/DataContext';
import DescribeBusinessPage from './page/DescribeBusinessPage';
import ImageEditor from './page/ImageEditor';
import Header from './page/Header';
import Login from './page/Login';
import About from './page/About';
import Contact from './page/Contact';
const App = () => {
  return (
    <DataProvider> {/* Wrap your components with DataProvider */}
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<DescribeBusinessPage/>} />
          <Route path="/image-editor" element={<ImageEditor/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          {/* ... other routes ... */}
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;

