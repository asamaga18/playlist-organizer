import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotifyLogin from './components/Auth/SpotifyLogin';
import PlaylistManager from './components/PlaylistManager/PlaylistManager';
import CallbackHandler from './components/CallbackHandler';
import './App.css';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;