const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const SCOPES = [
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private'
].join(' ');

export const getSpotifyAuthUrl = () => {
  console.log('=== DEBUG AUTH URL ===');
  console.log('Client ID:', CLIENT_ID);
  console.log('Client ID type:', typeof CLIENT_ID);
  console.log('Client ID length:', CLIENT_ID ? CLIENT_ID.length : 'undefined');
  console.log('Redirect URI:', REDIRECT_URI);
  
  if (!CLIENT_ID) {
    console.error('❌ CLIENT_ID is missing!');
    return null;
  }

  if (CLIENT_ID === 'undefined' || CLIENT_ID.length === 0) {
    console.error('❌ CLIENT_ID is invalid:', CLIENT_ID);
    return null;
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true'
  });
  
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('✅ Generated Auth URL:', authUrl);
  
  return authUrl;
};

export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  if (!hash) return null;
  
  const params = new URLSearchParams(hash);
  return params.get('access_token');
};