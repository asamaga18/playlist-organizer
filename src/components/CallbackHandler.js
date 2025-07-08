import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCodeFromUrl, getErrorFromUrl, exchangeCodeForToken } from '../utils/spotifyAuth';

const CallbackHandler = ({ onTokenReceived }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = getCodeFromUrl();
      const error = getErrorFromUrl();
      if (error) {
        setError(`Authentication failed: ${error}`);
        setIsAuthenticating(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      if (code) {
        try {
          setStatus('Exchanging code for access token...');
          const token = await exchangeCodeForToken(code);
          setStatus('Authentication successful! Redirecting...');
          setIsAuthenticating(false);
          onTokenReceived(token);
          navigate('/');
        } catch (err) {
          setError(`Token exchange failed: ${err.message}`);
          setIsAuthenticating(false);
          setTimeout(() => navigate('/'), 5000);
        }
      } else {
        setError('No authorization code received. Please try logging in again.');
        setIsAuthenticating(false);
        setTimeout(() => navigate('/'), 3000);
      }
    };
    handleCallback();
  }, [onTokenReceived, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#181818',
      fontFamily: 'Montserrat, Arial, sans-serif',
    }}>
      <h2 style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: '2.2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span role="img" aria-label="music">🎵</span> Spotify Authentication
      </h2>
      {error ? (
        <div style={{ color: '#ff4757', fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: 8 }}>❌</span>
          {error}
          <div style={{ fontSize: '1rem', color: '#aaa', marginTop: 10 }}>Redirecting back to login...</div>
        </div>
      ) : (
        <div style={{ color: '#1db954', fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAuthenticating ? (
            <span className="auth-spinner" style={{ width: 28, height: 28, display: 'inline-block' }}>
              <span style={{
                display: 'inline-block',
                width: 28,
                height: 28,
                border: '4px solid #1db954',
                borderTop: '4px solid #222',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                verticalAlign: 'middle',
              }} />
            </span>
          ) : (
            <span style={{ fontSize: '2rem', verticalAlign: 'middle' }}>✅</span>
          )}
          {status}
        </div>
      )}
      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CallbackHandler;