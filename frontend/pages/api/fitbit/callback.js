import axios from 'axios';
import { stringify } from 'querystring';

// Fitbit OAuth configuration
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || '23Q4RP';
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || '2d1b59b8c3f33379352cc988508d3252';
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI || 'http://localhost:3000/api/fitbit/callback';

export default async function handler(req, res) {
  // Debug log to check if client ID and secret are available
  console.log('FITBIT_CLIENT_ID:', FITBIT_CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);
  
  const { code } = req.query;
  
  if (!code) {
    console.error('No authorization code received from Fitbit');
    return res.redirect('/settings?error=fitbit_auth_failed');
  }
  
  try {
    console.log('Exchanging authorization code for access token...');
    
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', 
      stringify({
        code,
        grant_type: 'authorization_code',
        client_id: FITBIT_CLIENT_ID,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')
        }
      }
    );
    
    console.log('Token exchange successful');
    const { access_token, refresh_token, expires_in, user_id } = tokenResponse.data;
    
    // Get user profile information
    console.log('Fetching user profile information...');
    const profileResponse = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const { user } = profileResponse.data;
    console.log('Connected to Fitbit user:', user.displayName);
    
    // Create a connection object
    const connection = {
      isConnected: true,
      lastSync: new Date().toISOString(),
      username: user.displayName,
      userId: user_id,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in
    };
    
    console.log('Setting connection cookie...');
    // Set a cookie with the connection information
    res.setHeader('Set-Cookie', `fitbit_connection=${JSON.stringify(connection)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${expires_in}`);
    
    // Also store in localStorage for the frontend to access
    // We can't directly set localStorage from the server, so we'll pass the username in the URL
    console.log('Redirecting to settings page...');
    return res.redirect(`/settings?tab=integrations&fitbit=connected&username=${encodeURIComponent(user.displayName)}`);
  } catch (error) {
    console.error('Error exchanging Fitbit authorization code:', error.response?.data || error.message);
    return res.redirect('/settings?error=fitbit_token_exchange_failed');
  }
} 