import CryptoJS from 'crypto-js';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '614b405b104b4bee8475739d8b9ffafa';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const SCOPES = [
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private'
].join(' ');

// Generate code verifier and challenge for PKCE
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeChallenge(codeVerifier) {
  const hash = CryptoJS.SHA256(codeVerifier);
  return hash.toString(CryptoJS.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export const getSpotifyAuthUrl = () => {
  console.log('=== GENERATING SPOTIFY AUTH URL ===');
  console.log('Client ID:', CLIENT_ID);
  console.log('Redirect URI:', REDIRECT_URI);
  
  if (!CLIENT_ID) {
    console.error('CLIENT_ID is missing!');
    return null;
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Store code verifier for later use
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  console.log('Code verifier generated and stored');
  console.log('Code challenge:', codeChallenge);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code', // Changed from 'token' to 'code'
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    show_dialog: 'true'
  });
  
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('Generated Auth URL:', authUrl);
  
  return authUrl;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  console.log('=== EXCHANGING CODE FOR TOKEN ===');
  
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }
  
  console.log('Using stored code verifier');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });
  
  console.log('Token exchange response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Token exchange failed:', errorData);
    throw new Error(`Token exchange failed: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Token exchange successful');
  
  // Clean up code verifier
  localStorage.removeItem('spotify_code_verifier');
  
  return data.access_token;
};

// Get authorization code from URL
export const getCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};

// Get error from URL
export const getErrorFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('error');
};