import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure this URL matches your server route for contact form submissions
      await axios.post('http://localhost:8080/api/contact', { name, email, message });
      setSubmitted(true);
    } catch (error) {
      console.log('Submit error:', error);
    }
  };

  if (submitted) {
    return <div className="submission-success">Thank you! Your message has been submitted successfully.</div>;
  }

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          required
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
