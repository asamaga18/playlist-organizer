// import React from 'react';
// import { getSpotifyAuthUrl } from '../../utils/spotifyAuth';

// const SpotifyLogin = () => {
//   const handleLogin = () => {
//     console.log('Button clicked - starting PKCE auth process');
    
//     const authUrl = getSpotifyAuthUrl();
    
//     if (!authUrl) {
//       alert('Error: Could not generate Spotify auth URL. Check console for details.');
//       return;
//     }
    
//     console.log('Redirecting to Spotify...');
//     window.location.href = authUrl;
//   };

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       height: '100vh',
//       background: 'linear-gradient(135deg, #1db954, #191414)',
//       color: 'white',
//       fontFamily: 'Arial, sans-serif',
//       textAlign: 'center'
//     }}>
//       <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
//         🎵 Playlist Organizer
//       </h1>
//       <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
//         Easily distribute songs from one playlist to multiple other playlists. 
//         Connect with Spotify to get started!
//       </p>
//       <button 
//         onClick={handleLogin}
//         style={{
//           padding: '15px 30px',
//           fontSize: '18px',
//           backgroundColor: '#1db954',
//           color: 'white',
//           border: 'none',
//           borderRadius: '25px',
//           cursor: 'pointer',
//           fontWeight: 'bold',
//           transition: 'background-color 0.3s'
//         }}
//         onMouseOver={(e) => e.target.style.backgroundColor = '#1ed760'}
//         onMouseOut={(e) => e.target.style.backgroundColor = '#1db954'}
//       >
//         Connect with Spotify
//       </button>
//     </div>
//   );
// };

// export default SpotifyLogin;


import React from 'react';
import { getSpotifyAuthUrl } from '../../utils/spotifyAuth';
import './SpotifyLogin.css';

const SpotifyLogin = () => {
  const handleLogin = () => {
    console.log('Button clicked - starting PKCE auth process');
    
    const authUrl = getSpotifyAuthUrl();
    
    if (!authUrl) {
      alert('Error: Could not generate Spotify auth URL. Check console for details.');
      return;
    }
    
    console.log('Redirecting to Spotify...');
    window.location.href = authUrl;
  };

  return (
    <div className="spotify-login-container">
      <h1 className="spotify-login-title">
        🎵 Playlist Organizer
      </h1>
      <p className="spotify-login-description">
        Easily distribute songs from one playlist to multiple other playlists. 
        Connect with Spotify to get started!
      </p>
      <button 
        onClick={handleLogin}
        className="spotify-connect-button"
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default SpotifyLogin;