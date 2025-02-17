import React, { useState } from 'react';
import '../styles/LoginPage.css';
import backgroundImg from '../assets/Frame 1597881298.png';
import logo from '../assets/Logo.svg';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate login success
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Simulate Google login success
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="login-page-container">
      <div className="login-page-section">
        <div className="login-page-logo">
          <img src={logo} alt="Meets" className="login-page-meets-logo" />
          <span className="login-page-logo-text login-page-roboto-variable">Meets</span>
        </div>
        <div className="login-page-form-container">
          <h1 className="login-page-title login-page-roboto-variable">Login</h1>
          <p className="login-page-subtitle login-page-roboto-variable">
            Enter your credential to access your account.
          </p>  
          <div className="login-page-placeholder">
          <button onClick={handleGoogleLogin} className="login-page-btn google-login-btn">
            Login with Google
          </button>
          </div>
          <div className="login-page-divider">
            <span>Or</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="login-page-form-group">
              <label htmlFor="email" className="login-page-label">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-page-input"
              />
            </div>
            <div className="login-page-form-group">
              <div className="login-page-password-header">
                <label htmlFor="password" className="login-page-label">Password</label>
                <a href="/forgot-password" className="login-page-forgot-link">Forgot Password?</a>
              </div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-page-input"
              />
            </div>
            <button type="submit" className="login-page-btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <div className="login-page-right-section">
        <img src={backgroundImg} alt="Background" />
      </div>
    </div>
  );
};

export default LoginPage;
