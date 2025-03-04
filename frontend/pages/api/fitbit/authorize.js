import { stringify } from 'querystring';

// Fitbit OAuth configuration
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || '23Q4RP';
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI || 'http://localhost:3000/api/fitbit/callback';
const SCOPE = 'activity heartrate location nutrition profile settings sleep social weight';

export default function handler(req, res) {
  // Debug log to check if client ID is available
  console.log('FITBIT_CLIENT_ID:', FITBIT_CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);
  
  // Construct the authorization URL
  const authUrl = 'https://www.fitbit.com/oauth2/authorize?' + 
    stringify({
      response_type: 'code',
      client_id: FITBIT_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      expires_in: 604800 // 1 week in seconds
    });
  
  console.log('Auth URL:', authUrl);
  
  // Redirect the user to the Fitbit authorization page
  res.redirect(authUrl);
} 