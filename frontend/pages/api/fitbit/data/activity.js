import axios from 'axios';
import { parse } from 'cookie';
import { generateMockActivityData } from '../../../../services/mock-data-service';

export default async function handler(req, res) {
  // Get the period from the query params
  const period = req.query.period || '7d';
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    // If not connected, return mock data
    const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
    const activityData = generateMockActivityData(days);
    return res.status(200).json(activityData);
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    
    // Calculate the date range based on the period
    const endDate = new Date();
    const startDate = new Date();
    if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '14d') {
      startDate.setDate(startDate.getDate() - 14);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Fetch activity data from Fitbit API
    const activityResponse = await axios.get(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${formatDate(startDate)}/${formatDate(endDate)}.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );
    
    // Process the response into the format expected by the frontend
    const activityData = activityResponse.data['activities-steps'].map(day => ({
      date: day.dateTime,
      summary: {
        steps: parseInt(day.value),
        // You would fetch these separately in a real app
        distance: parseInt(day.value) * 0.0008,
        calories: Math.floor(parseInt(day.value) * 0.05),
        activeMinutes: Math.floor(parseInt(day.value) / 200)
      }
    }));
    
    return res.status(200).json(activityData);
  } catch (error) {
    console.error('Error fetching Fitbit activity data:', error);
    
    // If there's an error, return mock data
    const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
    const activityData = generateMockActivityData(days);
    return res.status(200).json(activityData);
  }
} 