import Login from './components/login'
import Home from './components/home'
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />}/>
      {/* Define other routes */}
    </Routes>
  </div>
  );
}

export default App;
