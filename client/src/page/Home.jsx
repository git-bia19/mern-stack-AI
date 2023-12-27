import React from 'react';
import Header from './Header';
import BusinessNameInput from './BusinessNameInput';
import './Home.css';
const Home = () => {
  return (
    <div>
      <Header />
      {/* Content of your home page */}
      <h1>Launch your business in just a few clicks</h1>
      <p>All tools in one place for your business to look professional and unique.</p>
      <BusinessNameInput />
    </div>
  );
};

export default Home;
