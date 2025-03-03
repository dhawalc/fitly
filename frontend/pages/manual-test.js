import React, { useState } from 'react';
import axios from 'axios';

export default function ManualTest() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testEndpoint = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);
      setResult({
        url,
        status: response.status,
        data: response.data
      });
    } catch (err) {
      setError({
        url,
        message: err.message,
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manual API Testing</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => testEndpoint('http://localhost:5000/ping')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test Ping
        </button>
        
        <button 
          onClick={() => testEndpoint('http://localhost:5000/')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test Root
        </button>
        
        <button 
          onClick={() => testEndpoint('http://localhost:5000/api/users')}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Test Users
        </button>
      </div>
      
      {loading && <p className="mt-4">Loading...</p>}
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h2 className="font-bold">Success: {result.url}</h2>
          <pre className="mt-2 bg-white p-2 rounded overflow-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h2 className="font-bold">Error: {error.url}</h2>
          <p className="text-red-600">{error.message}</p>
          <p>Code: {error.code}</p>
        </div>
      )}
    </div>
  );
} 