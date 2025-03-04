import envConfig from '../../../config/env-config';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // In a real app, you would call your backend to disconnect from Fitbit
    // const response = await axios.post(`${envConfig.BACKEND_API_URL}/api/fitbit/disconnect`);
    // return res.status(200).json(response.data);
    
    // For testing, simulate a successful disconnect
    return res.status(200).json({ 
      success: true, 
      message: 'Disconnected from Fitbit successfully'
    });
  } catch (error) {
    console.error('Error disconnecting from Fitbit:', error);
    return res.status(500).json({ error: 'Failed to disconnect from Fitbit' });
  }
} 