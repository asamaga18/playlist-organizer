import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SpotifyLogin from './components/Auth/SpotifyLogin';
import PlaylistManager from './components/PlaylistManager/PlaylistManager';
import CallbackHandler from './components/CallbackHandler';
import './App.css';

// Debug component to log the current path
const RouteDebugger = () => {
  const location = useLocation();
  console.log('Current path:', location.pathname);
  console.log('Current hash:', location.hash);
  console.log('Full location:', location);
  return null;
};

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
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
      <div className="App">
        <RouteDebugger />
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