import React from 'react'
import { Routes, Route } from "react-router-dom";
import ProjectManLanding from './pages/ProjectManLanding'
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectManLanding />} />
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  )
}

export default App