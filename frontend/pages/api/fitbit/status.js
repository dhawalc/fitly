import { parse } from 'cookie';

export default function handler(req, res) {
  console.log('Checking Fitbit connection status...');
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    console.log('No Fitbit connection cookie found');
    return res.status(200).json({
      isConnected: false,
      lastSync: null,
      username: null
    });
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    console.log('Fitbit connection found for user:', connection.username);
    
    return res.status(200).json({
      isConnected: true,
      lastSync: connection.lastSync,
      username: connection.username
    });
  } catch (error) {
    console.error('Error parsing Fitbit connection cookie:', error);
    return res.status(200).json({
      isConnected: false,
      lastSync: null,
      username: null
    });
  }
} 