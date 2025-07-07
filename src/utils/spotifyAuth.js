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
    console.log('Code verifiers already cleaned up, skipping...');
    return;
  }
  
  console.log('Cleaning up code verifiers from storage');
  sessionStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_code_verifier_backup');
  hasCleanedUp = true;
}

export const getSpotifyAuthUrl = () => {
  console.log('=== GENERATING SPOTIFY AUTH URL ===');
  console.log('Client ID:', CLIENT_ID);
  console.log('Redirect URI:', REDIRECT_URI);
  
  if (!CLIENT_ID) {
    console.error('CLIENT_ID is missing!');
    return null;
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
    
    console.log('Code verifier stored in sessionStorage and localStorage backup');
    
    // Verify storage
    const sessionVerifier = sessionStorage.getItem('spotify_code_verifier');
    const localVerifier = localStorage.getItem('spotify_code_verifier_backup');
    
    if (sessionVerifier !== codeVerifier) {
      console.error('SessionStorage verification failed!');
      throw new Error('Failed to store code verifier in sessionStorage');
    }
    
    if (localVerifier !== codeVerifier) {
      console.error('LocalStorage backup verification failed!');
      throw new Error('Failed to store code verifier backup in localStorage');
    }
    
    console.log('Code verifier storage verified in both locations');
  } catch (error) {
    console.error('Error storing code verifier:', error);
    throw new Error('Failed to store code verifier: ' + error.message);
  }
  
  console.log('Code verifier generated and stored');
  console.log('Code challenge:', codeChallenge);

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
  console.log('Generated Auth URL:', authUrl);
  
  return authUrl;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  console.log('=== EXCHANGING CODE FOR TOKEN ===');
  console.log('Authorization code received:', code ? 'YES' : 'NO');
  
  // Debug: Check what's in storage
  console.log('SessionStorage keys:', Object.keys(sessionStorage));
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('spotify_code_verifier in sessionStorage:', sessionStorage.getItem('spotify_code_verifier') ? 'EXISTS' : 'MISSING');
  console.log('spotify_code_verifier_backup in localStorage:', localStorage.getItem('spotify_code_verifier_backup') ? 'EXISTS' : 'MISSING');
  
  // Try to get code verifier from sessionStorage first, then localStorage backup
  let codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  
  if (!codeVerifier) {
    console.log('Code verifier not found in sessionStorage, trying localStorage backup...');
    codeVerifier = localStorage.getItem('spotify_code_verifier_backup');
    
    if (codeVerifier) {
      console.log('Found code verifier in localStorage backup, restoring to sessionStorage');
      sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    }
  }
  
  if (!codeVerifier) {
    console.error('Code verifier not found in either storage location');
    console.error('SessionStorage contents:', Object.keys(sessionStorage));
    console.error('LocalStorage contents:', Object.keys(localStorage));
    throw new Error('Code verifier not found. This might be due to browser storage issues, page refresh, or the authentication session expiring.');
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
    throw new Error(`Token exchange failed: ${response.status} - ${errorData}`);
  }
  
  const data = await response.json();
  console.log('Token exchange successful');
  
  // Clean up code verifiers from both storage locations
  cleanupCodeVerifiers();
  
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