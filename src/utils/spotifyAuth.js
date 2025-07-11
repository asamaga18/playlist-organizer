import CryptoJS from 'crypto-js';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '614b405b104b4bee8475739d8b9ffafa';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const SCOPES = [
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private'
].join(' ');

// Track if we've already cleaned up to prevent multiple cleanups
let hasCleanedUp = false;

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

// Clean up code verifiers from storage
function cleanupCodeVerifiers() {
  if (hasCleanedUp) {
    return;
  }
  
  sessionStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_code_verifier_backup');
  hasCleanedUp = true;
}

export const getSpotifyAuthUrl = () => {
  if (!CLIENT_ID) {
    throw new Error('CLIENT_ID is missing!');
  }

  // Reset cleanup flag for new auth flow
  hasCleanedUp = false;

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Store code verifier in both sessionStorage and localStorage for redundancy
  try {
    // Use sessionStorage as primary storage (survives redirects but not tab closes)
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    
    // Also store in localStorage as backup
    localStorage.setItem('spotify_code_verifier_backup', codeVerifier);
    
    // Verify storage
    const sessionVerifier = sessionStorage.getItem('spotify_code_verifier');
    const localVerifier = localStorage.getItem('spotify_code_verifier_backup');
    
    if (sessionVerifier !== codeVerifier) {
      throw new Error('Failed to store code verifier in sessionStorage');
    }
    
    if (localVerifier !== codeVerifier) {
      throw new Error('Failed to store code verifier backup in localStorage');
    }
    
  } catch (error) {
    throw new Error('Failed to store code verifier: ' + error.message);
  }
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    show_dialog: 'true'
  });
  
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  return authUrl;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  
  // Try to get code verifier from sessionStorage first, then localStorage backup
  let codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  
  if (!codeVerifier) {
    codeVerifier = localStorage.getItem('spotify_code_verifier_backup');
    
    if (codeVerifier) {
      sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    }
  }
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found in either storage location');
  }
  
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
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorData}`);
  }
  
  const data = await response.json();
  
  // Clean up code verifiers from both storage locations
  cleanupCodeVerifiers();
  
  return data.access_token;
};

// Get authorization code from URL
export const getCodeFromUrl = () => {
  // For HashRouter: #/callback?code=...
  const hash = window.location.hash; // e.g. "#/callback?code=..."
  const queryString = hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  return params.get('code');
};

// Get error from URL
export const getErrorFromUrl = () => {
  const hash = window.location.hash;
  const queryString = hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  return params.get('error');
};