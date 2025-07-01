// import React from 'react';
// import { getSpotifyAuthUrl } from '../../utils/spotifyAuth';
// import styled from 'styled-components';

// const LoginContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;
//   background: linear-gradient(135deg, #1db954, #191414);
//   color: white;
//   text-align: center;
// `;

// const Title = styled.h1`
//   font-size: 3rem;
//   margin-bottom: 1rem;
// `;

// const Description = styled.p`
//   font-size: 1.2rem;
//   margin-bottom: 2rem;
//   max-width: 600px;
// `;

// const LoginButton = styled.button`
//   background: #1db954;
//   color: white;
//   border: none;
//   padding: 15px 30px;
//   border-radius: 25px;
//   font-size: 16px;
//   font-weight: bold;
//   cursor: pointer;
//   transition: background 0.3s;

//   &:hover {
//     background: #1ed760;
//   }
  
//   &:disabled {
//     background: #ccc;
//     cursor: not-allowed;
//   }
// `;

// const ErrorMessage = styled.div`
//   background: #ff4757;
//   color: white;
//   padding: 10px 20px;
//   border-radius: 5px;
//   margin-bottom: 20px;
// `;

// const DebugInfo = styled.div`
//   background: #333;
//   color: #fff;
//   padding: 10px;
//   border-radius: 5px;
//   margin-bottom: 20px;
//   font-family: monospace;
//   font-size: 12px;
//   max-width: 600px;
//   word-break: break-all;
// `;

// const SpotifyLogin = () => {
//   const handleLogin = (e) => {
//     e.preventDefault(); // Prevent any default form behavior
    
//     console.log('🔵 Login button clicked');
    
//     const authUrl = getSpotifyAuthUrl();
    
//     console.log('🔵 Auth URL result:', authUrl);
    
//     if (!authUrl) {
//       console.error('❌ No auth URL generated');
//       alert('Error: Could not generate Spotify auth URL. Check console for details.');
//       return;
//     }
    
//     console.log('🔵 Redirecting to:', authUrl);
    
//     // Try different redirect methods
//     try {
//       window.location.href = authUrl;
//     } catch (error) {
//       console.error('❌ Redirect failed:', error);
//       // Fallback
//       window.open(authUrl, '_self');
//     }
//   };

//   // Get debug info
//   const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
//   const redirectUri = process.env.REACT_APP_REDIRECT_URI;
  
//   return (
//     <LoginContainer>
//       <Title>🎵 Playlist Organizer</Title>
//       <Description>
//         Easily distribute songs from one playlist to multiple other playlists. 
//         Connect with Spotify to get started!
//       </Description>
      
//       <DebugInfo>
//         <div>Client ID: {clientId ? `${clientId.slice(0, 10)}...` : 'MISSING'}</div>
//         <div>Redirect URI: {redirectUri || 'MISSING'}</div>
//       </DebugInfo>
      
//       {!clientId && (
//         <ErrorMessage>
//           ⚠️ Spotify Client ID not configured. Please check your .env file.
//         </ErrorMessage>
//       )}
      
//       <LoginButton onClick={handleLogin} disabled={!clientId}>
//         Connect with Spotify
//       </LoginButton>
//     </LoginContainer>
//   );
// };

// export default SpotifyLogin;


import React from 'react';

const SpotifyLogin = () => {
  const handleLogin = () => {
    console.log('Button clicked - starting auth process');
    
    const CLIENT_ID = '614b405b104b4bee8475739d8b9ffafa';
    const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
    const SCOPES = 'playlist-read-private playlist-modify-private playlist-modify-public user-read-private';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&show_dialog=true`;
    
    console.log('Auth URL:', authUrl);
    console.log('About to redirect...');
    
    // Test the URL first
    alert('Check console for auth URL, then click OK to redirect');
    
    window.location.href = authUrl;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#1db954',
      color: 'white'
    }}>
      <h1>Playlist Organizer</h1>
      <button 
        onClick={handleLogin}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: '#191414',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default SpotifyLogin;