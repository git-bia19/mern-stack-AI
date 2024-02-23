import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './page/DataContext';
import DescribeBusinessPage from './page/DescribeBusinessPage';
import ResultPage from './page/ResultPage';
import ImageEditor from './page/ImageEditor';
import Header from './page/Header';

const App = () => {
  return (
    <DataProvider> {/* Wrap your components with DataProvider */}
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<DescribeBusinessPage />} />
          <Route path="/result-page" element={<ResultPage />} />
          <Route path="/image-editor" element={<ImageEditor />} />
          {/* ... other routes ... */}
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;

