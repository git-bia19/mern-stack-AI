import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // To toggle between login and signup

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8080/api/auth/${isLogin ? 'login' : 'signup'}`;

    try {
      const response = await axios.post(url, { email, password });
      console.log(response.data.message);
      // Handle response for login or registration success
    } catch (error) {
      console.error(error.response.data.message);
      // Handle error
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleAuth}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Go to Sign Up' : 'Go to Login'}</button>
      </form>
    </div>
  );
};

export default Login;
