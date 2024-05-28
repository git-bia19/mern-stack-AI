import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Ensure you have this CSS for styling

const Login = () => {
  const [isSignup, setIsSignup] = useState(true); // Toggle between Signup and Login
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/api/auth/${isSignup ? 'signup' : 'login'}`; // Updated to use your server routes on port 3000
    const data = isSignup ? { username, email, password } : { username, password };

    try {
      const response = await axios.post(url, data);
      setMessage(response.data.message);
      // You may want to handle login/authentication state here if login was successful
    } catch (error) {
      setMessage('Error: ' + (error.response?.data.message || 'Something went wrong'));
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        {isSignup && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? 'Login' : 'Sign Up'}
      </button>
    </div>
  );
};

export default Login;
