import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenFromUrl } from '../utils/spotifyAuth';

const CallbackHandler = ({ onTokenReceived }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromUrl();
    
    if (token) {
      onTokenReceived(token);
      navigate('/');
    } else {
      navigate('/');
    }
  }, [onTokenReceived, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Connecting to Spotify...</h2>
      <p>Please wait while we complete the authentication.</p>
    </div>
  );
};

export default CallbackHandler;