import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SpotifyLogin from './components/Auth/SpotifyLogin';
import PlaylistManager from './components/PlaylistManager/PlaylistManager';
import CallbackHandler from './components/CallbackHandler';
import './App.css';

// Fix for Spotify's non-standard redirect
const BrokenSpotifyRedirectFix = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === '/%2Fcallback' ||
      window.location.hash === '#%2Fcallback'
    ) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        navigate(`/callback?code=${code}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleTokenReceived = (newToken) => {
    setToken(newToken);
    localStorage.setItem('spotify_token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('spotify_token');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <BrokenSpotifyRedirectFix />
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              token ? (
                <PlaylistManager token={token} onLogout={handleLogout} />
              ) : (
                <SpotifyLogin />
              )
            } 
          />
          <Route 
            path="/callback" 
            element={<CallbackHandler onTokenReceived={handleTokenReceived} />} 
          />
          <Route 
            path="*" 
            element={<div style={{color: 'red'}}>No route matched!</div>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;