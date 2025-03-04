import envConfig from '../../../../config/env-config';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    // In a real app, you would fetch this from your backend
    // const response = await axios.get(`${envConfig.BACKEND_API_URL}/api/fitbit/data/weight`);
    // return res.status(200).json(response.data);
    
    // For testing, return mock data
    return res.status(200).json({
      current: 165.2,
      goal: 160,
      history: [
        { date: '2023-07-01', weight: 168.5 },
        { date: '2023-07-15', weight: 166.8 },
        { date: '2023-08-01', weight: 165.2 }
      ]
    });
  } catch (error) {
    console.error('Error fetching Fitbit weight data:', error);
    return res.status(500).json({ error: 'Failed to fetch weight data' });
  }
} 