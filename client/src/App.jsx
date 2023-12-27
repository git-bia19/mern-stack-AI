import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './page/DataContext';
import Home from './page/Home';
import DescribeBusinessPage from './page/DescribeBusinessPage';
import TargetAudienceSelection from './page/TargetAudienceSelection';
import ColorThemeSelection from './page/ColorThemeSelection';
import ResultPage from './page/ResultPage';
import ImageEditor from './page/ImageEditor';
import DesignSelection  from './page/DesignSelect';

const App = () => {
  return (
    <DataProvider> {/* Wrap your components with DataProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/describe-business" element={<DescribeBusinessPage />} />
          <Route path="/target-audience" element={<TargetAudienceSelection />} />
          <Route path="/design-select" element={<DesignSelection/>} />
          <Route path="/color-theme-selection" element={<ColorThemeSelection />} />
          <Route path="/result-page" element={<ResultPage />} />
          <Route path="/image-editor" element={<ImageEditor />} />
          {/* ... other routes ... */}
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;

