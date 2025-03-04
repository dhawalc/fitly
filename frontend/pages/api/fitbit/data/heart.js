import envConfig from '../../../../config/env-config';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    // In a real app, you would fetch this from your backend
    // const response = await axios.get(`${envConfig.BACKEND_API_URL}/api/fitbit/data/heart`);
    // return res.status(200).json(response.data);
    
    // For testing, return mock data
    return res.status(200).json({
      restingHeartRate: 68,
      zones: {
        outOfRange: { min: 30, max: 91, minutes: 1220 },
        fatBurn: { min: 91, max: 127, minutes: 180 },
        cardio: { min: 127, max: 154, minutes: 35 },
        peak: { min: 154, max: 220, minutes: 5 }
      }
    });
  } catch (error) {
    console.error('Error fetching Fitbit heart rate data:', error);
    return res.status(500).json({ error: 'Failed to fetch heart rate data' });
  }
} 