import { parse } from 'cookie';
import axios from 'axios';

export default async function handler(req, res) {
  // Only show this in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    return res.status(200).json({ error: 'No Fitbit connection cookie found' });
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Fetch sleep data from Fitbit API
    const sleepResponse = await axios.get(
      `https://api.fitbit.com/1.2/user/-/sleep/date/${formatDate(startDate)}/${formatDate(endDate)}.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );
    
    // Return the raw response data
    return res.status(200).json({
      rawData: sleepResponse.data,
      processedCount: sleepResponse.data.sleep.length,
      firstItem: sleepResponse.data.sleep.length > 0 ? sleepResponse.data.sleep[0] : null
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error fetching sleep data', 
      message: error.message,
      response: error.response?.data
    });
  }
} 