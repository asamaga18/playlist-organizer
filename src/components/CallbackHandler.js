import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCodeFromUrl, getErrorFromUrl, exchangeCodeForToken } from '../utils/spotifyAuth';

const CallbackHandler = ({ onTokenReceived }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('=== CALLBACK HANDLER DEBUG ===');
      console.log('Full URL:', window.location.href);
      console.log('Search params:', window.location.search);
      
      const code = getCodeFromUrl();
      const error = getErrorFromUrl();
      
      console.log('Authorization code:', code ? 'FOUND' : 'NOT FOUND');
      console.log('Error:', error);
      
      if (error) {
        console.error('Spotify auth error:', error);
        setError(`Authentication failed: ${error}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      if (code) {
        try {
          setStatus('Exchanging code for access token...');
          console.log('Attempting to exchange code for token');
          
          const token = await exchangeCodeForToken(code);
          
          console.log('Token received successfully');
          setStatus('Authentication successful! Redirecting...');
          
          onTokenReceived(token);
          
          setTimeout(() => navigate('/'), 1000);
        } catch (err) {
          console.error('Token exchange error:', err);
          setError(`Token exchange failed: ${err.message}`);
          setTimeout(() => navigate('/'), 3000);
        }
      } else {
        console.log('No code found, redirecting to home');
        setError('No authorization code received');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [onTokenReceived, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>🎵 Spotify Authentication</h2>
      
      {error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>
          <p>❌ {error}</p>
          <p>Redirecting back to login...</p>
        </div>
      ) : (
        <div style={{ color: 'green', textAlign: 'center' }}>
          <p>✅ {status}</p>
        </div>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '600px',
        wordBreak: 'break-all'
      }}>
        <strong>Debug Info:</strong><br/>
        URL: {window.location.href}
      </div>
    </div>
  );
};

export default CallbackHandler;