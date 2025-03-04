import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout-old';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WorkoutLog from './pages/WorkoutLog';
import NutritionTracker from './pages/NutritionTracker';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workouts" element={<WorkoutLog />} />
          <Route path="/nutrition" element={<NutritionTracker />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 