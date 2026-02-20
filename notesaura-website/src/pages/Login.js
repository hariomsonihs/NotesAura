import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card card">
          <div className="login-header gradient-primary">
            <h1>NotesAura</h1>
            <p>Learn Programming with Style 🚀</p>
          </div>

          <div className="login-form">
            <h2>{isLogin ? 'Welcome Back! 👋' : 'Create Account 🎉'}</h2>
            
            {error && <div className="error-message">❌ {error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
