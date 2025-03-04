import React, { useState, useEffect } from 'react';
import { FitbitService } from '../services/fitbit-service';
import { format, parseISO } from 'date-fns';
import DebugData from './debug-data';

export default function SleepTab() {
  const [sleepData, setSleepData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First check if Fitbit is connected
        const status = await FitbitService.getConnectionStatus();
        console.log('Connection status:', status);
        setConnectionStatus(status);
        
        // Fetch sleep data
        console.log('Fetching sleep data for period:', period);
        const data = await FitbitService.getSleepData(period);
        console.log('Sleep data received in component:', data);
        console.log('Sleep data length:', data ? data.length : 0);
        
        // Check if data is valid
        if (!data) {
          console.error('Sleep data is null or undefined');
          setDataError('Sleep data is null or undefined');
          setSleepData([]);
          return;
        }
        
        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error('Sleep data is not an array:', typeof data);
          setDataError(`Sleep data is not an array: ${typeof data}`);
          setSleepData([]);
          return;
        }
        
        // Check if data has the expected structure
        if (data.length > 0) {
          const firstItem = data[0];
          console.log('First sleep data item:', firstItem);
          
          if (!firstItem.date) {
            console.error('Sleep data item is missing date property');
            setDataError('Sleep data item is missing date property');
          }
          
          if (!firstItem.summary) {
            console.error('Sleep data item is missing summary property');
            setDataError('Sleep data item is missing summary property');
          }
        }
        
        if (data && data.length > 0) {
          console.log('Setting sleep data with', data.length, 'records');
          setSleepData(data);
        } else {
          console.log('No sleep data available, setting empty array');
          setSleepData([]);
        }
      } catch (err) {
        console.error('Error fetching sleep data:', err);
        setError('Failed to load sleep data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const refreshData = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Sync Fitbit data
      await FitbitService.sync();
      
      // Fetch updated sleep data
      const data = await FitbitService.getSleepData(period);
      console.log('Refreshed sleep data:', data);
      
      if (data && data.length > 0) {
        setSleepData(data);
      } else {
        console.log('No sleep data available after refresh');
        setSleepData([]);
      }
    } catch (err) {
      console.error('Error refreshing sleep data:', err);
      setError('Failed to refresh sleep data. Please try again later.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate average sleep metrics
  const calculateAverages = () => {
    if (!sleepData || sleepData.length === 0) return null;
    
    const totalDuration = sleepData.reduce((sum, day) => sum + (day.summary?.duration || 0), 0);
    const totalEfficiency = sleepData.reduce((sum, day) => sum + (day.summary?.efficiency || 0), 0);
    const totalDeep = sleepData.reduce((sum, day) => sum + (day.summary?.deepSleep || 0), 0);
    const totalLight = sleepData.reduce((sum, day) => sum + (day.summary?.lightSleep || 0), 0);
    const totalRem = sleepData.reduce((sum, day) => sum + (day.summary?.remSleep || 0), 0);
    
    return {
      avgDuration: Math.round(totalDuration / sleepData.length),
      avgEfficiency: Math.round(totalEfficiency / sleepData.length),
      avgDeep: Math.round(totalDeep / sleepData.length),
      avgLight: Math.round(totalLight / sleepData.length),
      avgRem: Math.round(totalRem / sleepData.length)
    };
  };

  const averages = calculateAverages();

  // Format time (minutes) to hours and minutes
  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!connectionStatus.isConnected) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">Connect your Fitbit account to see your sleep data.</p>
        <button 
          onClick={() => FitbitService.connect()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Connect Fitbit
        </button>
      </div>
    );
  }

  if (!sleepData || sleepData.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No sleep data available from Fitbit. Try manually logging your sleep.</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Fitbit Data'}
          </button>
          <a 
            href="https://www.fitbit.com/sleep" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Log Sleep on Fitbit
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Connected as: {connectionStatus.username || 'Unknown user'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1 rounded-md ${period === '7d' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setPeriod('14d')}
            className={`px-3 py-1 rounded-md ${period === '14d' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            14 Days
          </button>
          <button 
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1 rounded-md ${period === '30d' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            30 Days
          </button>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Sleep summary */}
      {averages && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sleep Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Avg. Duration</p>
              <p className="text-xl font-bold text-indigo-700">{formatTime(averages.avgDuration)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Efficiency</p>
              <p className="text-xl font-bold text-green-700">{averages.avgEfficiency}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Deep Sleep</p>
              <p className="text-xl font-bold text-blue-700">{formatTime(averages.avgDeep)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">REM Sleep</p>
              <p className="text-xl font-bold text-purple-700">{formatTime(averages.avgRem)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Light Sleep</p>
              <p className="text-xl font-bold text-gray-700">{formatTime(averages.avgLight)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Daily sleep logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-6 pb-3">Daily Sleep Logs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deep</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Light</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wake Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sleepData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date ? format(parseISO(day.date), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(day.summary?.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.summary?.efficiency || 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(day.summary?.deepSleep)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(day.summary?.remSleep)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(day.summary?.lightSleep)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.bedtime ? format(parseISO(day.bedtime), 'h:mm a') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.wakeTime ? format(parseISO(day.wakeTime), 'h:mm a') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        Connected as: {connectionStatus.username || 'Unknown user'} | Last synced: {connectionStatus.lastSync ? format(parseISO(connectionStatus.lastSync), 'MMM d, yyyy h:mm a') : 'Never'}
      </p>
      
      {dataError && (
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-red-800 font-medium">Data Error</h3>
          <p className="text-red-700">{dataError}</p>
        </div>
      )}
      
      {/* Add the debug component at the bottom */}
      <DebugData data={sleepData} title="Sleep Data (Raw)" />
    </div>
  );
} 