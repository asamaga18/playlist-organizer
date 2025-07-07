import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCodeFromUrl, getErrorFromUrl, exchangeCodeForToken } from '../utils/spotifyAuth';

const CallbackHandler = ({ onTokenReceived }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple processing of the same callback
      if (hasProcessed.current) {
        console.log('Callback already processed, skipping...');
        return;
      }
      
      hasProcessed.current = true;
      
      console.log('=== CALLBACK HANDLER DEBUG ===');
      console.log('Full URL:', window.location.href);
      console.log('Search params:', window.location.search);
      
      // Debug storage state
      console.log('SessionStorage contents:', Object.keys(sessionStorage));
      console.log('LocalStorage contents:', Object.keys(localStorage));
      console.log('spotify_code_verifier in sessionStorage:', sessionStorage.getItem('spotify_code_verifier') ? 'EXISTS' : 'MISSING');
      console.log('spotify_code_verifier_backup in localStorage:', localStorage.getItem('spotify_code_verifier_backup') ? 'EXISTS' : 'MISSING');
      
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
          
          // Provide more specific error messages
          let errorMessage = err.message;
          if (err.message.includes('Code verifier not found')) {
            errorMessage = 'Authentication session expired. Please try logging in again. This can happen if the page was refreshed or if there were browser storage issues.';
          } else if (err.message.includes('invalid_grant')) {
            errorMessage = 'Authorization code has already been used or expired. Please try logging in again.';
          }
          
          setError(`Token exchange failed: ${errorMessage}`);
          setTimeout(() => navigate('/'), 5000); // Give more time to read the error
        }
      } else {
        console.log('No code found, redirecting to home');
        setError('No authorization code received. Please try logging in again.');
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
        <div style={{ color: 'red', textAlign: 'center', maxWidth: '600px' }}>
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
        URL: {window.location.href}<br/>
        SessionStorage keys: {Object.keys(sessionStorage).join(', ')}<br/>
        LocalStorage keys: {Object.keys(localStorage).join(', ')}<br/>
        Code verifier (session): {sessionStorage.getItem('spotify_code_verifier') ? 'EXISTS' : 'MISSING'}<br/>
        Code verifier (local backup): {localStorage.getItem('spotify_code_verifier_backup') ? 'EXISTS' : 'MISSING'}
      </div>
    </div>
  );
};

export default CallbackHandler;