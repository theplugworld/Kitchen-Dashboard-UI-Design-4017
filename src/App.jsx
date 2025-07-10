import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import KitchenDashboard from './components/KitchenDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KitchenDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;