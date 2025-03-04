import axios from 'axios';
import { parse } from 'cookie';
import { generateMockSleepData } from '../../../../services/mock-data-service';

export default async function handler(req, res) {
  // Get the period from the query params
  const period = req.query.period || '7d';
  console.log('Fetching sleep data for period:', period);
  
  // Get the connection information from the cookie
  const cookies = parse(req.headers.cookie || '');
  const connectionCookie = cookies.fitbit_connection;
  
  if (!connectionCookie) {
    console.log('No Fitbit connection cookie found, returning mock data');
    // If not connected, return mock data
    const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
    const sleepData = generateMockSleepData(days);
    return res.status(200).json(sleepData);
  }
  
  try {
    const connection = JSON.parse(connectionCookie);
    console.log('Fetching sleep data for user:', connection.username);
    
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
    
    console.log(`Fetching sleep data from ${formatDate(startDate)} to ${formatDate(endDate)}`);
    
    // Fetch sleep data from Fitbit API
    const sleepResponse = await axios.get(
      `https://api.fitbit.com/1.2/user/-/sleep/date/${formatDate(startDate)}/${formatDate(endDate)}.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );
    
    console.log('Sleep data received from Fitbit API');
    console.log('Number of sleep records:', sleepResponse.data.sleep.length);
    
    // Check if there are any sleep records
    if (sleepResponse.data.sleep.length === 0) {
      console.log('No sleep records found in Fitbit data');
      
      // Try a different endpoint for sleep data (the daily logs)
      console.log('Trying to fetch daily sleep logs...');
      
      // Create an array to store sleep data from daily logs
      const sleepData = [];
      
      // Fetch sleep data for each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = formatDate(currentDate);
        
        try {
          const dailySleepResponse = await axios.get(
            `https://api.fitbit.com/1.2/user/-/sleep/date/${dateStr}.json`,
            {
              headers: {
                'Authorization': `Bearer ${connection.accessToken}`
              }
            }
          );
          
          // Process each sleep entry for this day
          if (dailySleepResponse.data.sleep && dailySleepResponse.data.sleep.length > 0) {
            dailySleepResponse.data.sleep.forEach(sleep => {
              // Extract the date from the sleep log
              const date = sleep.dateOfSleep;
              
              // Calculate sleep stages
              const deep = sleep.levels?.summary?.deep?.minutes || 0;
              const light = sleep.levels?.summary?.light?.minutes || 0;
              const rem = sleep.levels?.summary?.rem?.minutes || 0;
              const awake = sleep.levels?.summary?.wake?.minutes || 0;
              
              sleepData.push({
                date,
                summary: {
                  duration: sleep.duration / 60000, // Convert from milliseconds to minutes
                  efficiency: sleep.efficiency,
                  deepSleep: deep,
                  lightSleep: light,
                  remSleep: rem,
                  awake: awake
                },
                bedtime: sleep.startTime,
                wakeTime: sleep.endTime
              });
            });
          }
        } catch (dailyError) {
          console.error(`Error fetching sleep data for ${dateStr}:`, dailyError.message);
        }
        
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log('Processed daily sleep logs:', sleepData.length, 'records');
      
      if (sleepData.length > 0) {
        return res.status(200).json(sleepData);
      }
      
      // If still no data, return mock data
      console.log('No sleep data found in daily logs, returning mock data');
      const mockSleepData = generateMockSleepData(period === '30d' ? 30 : period === '14d' ? 14 : 7);
      return res.status(200).json(mockSleepData);
    }
    
    // Process the response into the format expected by the frontend
    const sleepData = sleepResponse.data.sleep.map(sleep => {
      // Extract the date from the sleep log
      const date = sleep.dateOfSleep;
      
      // Calculate sleep stages
      const deep = sleep.levels?.summary?.deep?.minutes || 0;
      const light = sleep.levels?.summary?.light?.minutes || 0;
      const rem = sleep.levels?.summary?.rem?.minutes || 0;
      const awake = sleep.levels?.summary?.wake?.minutes || 0;
      
      return {
        date,
        summary: {
          duration: sleep.duration / 60000, // Convert from milliseconds to minutes
          efficiency: sleep.efficiency,
          deepSleep: deep,
          lightSleep: light,
          remSleep: rem,
          awake: awake
        },
        bedtime: sleep.startTime,
        wakeTime: sleep.endTime
      };
    });
    
    console.log('Processed sleep data:', sleepData.length, 'records');
    console.log('First sleep data item:', sleepData.length > 0 ? JSON.stringify(sleepData[0]) : 'No data');
    console.log('Sleep data structure is valid:', sleepData.every(item => 
      item.date && 
      item.summary && 
      typeof item.summary.duration === 'number' && 
      typeof item.summary.efficiency === 'number'
    ));
    
    return res.status(200).json(sleepData);
  } catch (error) {
    console.error('Error fetching Fitbit sleep data:', error.response?.data || error.message);
    
    // If there's an error, return mock data
    console.log('Returning mock sleep data due to error');
    const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
    const sleepData = generateMockSleepData(days);
    return res.status(200).json(sleepData);
  }
} 