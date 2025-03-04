import axios from 'axios';
import { parse } from 'cookie';
import { stringify } from 'querystring';

// Fitbit OAuth configuration
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || '23Q4RP';
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || '2d1b59b8c3f33379352cc988508d3252';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    return res.status(200).json({ success: true });
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    
    // Revoke the access token
    await axios.post('https://api.fitbit.com/oauth2/revoke', 
      stringify({
        token: connection.accessToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')
        }
      }
    );
    
    // Clear the connection cookie
    res.setHeader('Set-Cookie', 'fitbit_connection=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error revoking Fitbit access token:', error);
    return res.status(500).json({ error: 'Failed to revoke access token' });
  }
} 