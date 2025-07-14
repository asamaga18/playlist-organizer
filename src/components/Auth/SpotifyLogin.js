import React from 'react';
import { getSpotifyAuthUrl } from '../../utils/spotifyAuth';
import './SpotifyLogin.css';

const SpotifyLogin = () => {
  const handleLogin = () => {
    
    const authUrl = getSpotifyAuthUrl();
    
    if (!authUrl) {
      alert('Error: Could not generate Spotify auth URL. Check console for details.');
      return;
    }
    
    window.location.href = authUrl;
  };

  return (
    <div className="spotify-bg">
      <svg
        className="spotify-abstract-svg"
        viewBox="0 0 600 600"
        width="600"
        height="600"
        aria-hidden="true"
        focusable="false"
      >
        
      </svg>
      <div className="spotify-login-card">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png"
          alt="Spotify logo"
          className="spotify-logo-img"
          style={{ width: '50px', marginBottom: '1.2rem' }}
        />
        <div className="spotify-login-title">
          Playlist Organizer
        </div>
        <div className="spotify-login-desc">
          Easily distribute songs from one playlist to multiple others.<br />
          Connect with Spotify to get started!
        </div>
        <button 
          onClick={handleLogin}
          className="spotify-connect-button"
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
};

export default SpotifyLogin;