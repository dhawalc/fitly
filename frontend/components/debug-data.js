import React, { useState } from 'react';

export default function DebugData({ data, title = 'Debug Data' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data) return null;
  
  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {isExpanded && (
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
} 