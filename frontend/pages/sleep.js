import React from 'react';
import SleepTab from '../components/sleep-tab';

export default function SleepPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sleep Insights</h1>
      <SleepTab />
    </div>
  );
} 