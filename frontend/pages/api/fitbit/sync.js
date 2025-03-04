import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    return res.status(401).json({ error: 'Not connected to Fitbit' });
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    
    // In a real app, you would fetch the latest data from Fitbit
    // and store it in your database
    
    // Update the last sync time
    connection.lastSync = new Date().toISOString();
    
    // Update the connection cookie
    res.setHeader('Set-Cookie', `fitbit_connection=${JSON.stringify(connection)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${connection.expiresIn}`);
    
    return res.status(200).json({ success: true, lastSync: connection.lastSync });
  } catch (error) {
    console.error('Error syncing Fitbit data:', error);
    return res.status(500).json({ error: 'Failed to sync data' });
  }
} 