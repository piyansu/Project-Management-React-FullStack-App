import React from 'react'
import { Routes, Route } from "react-router-dom";
import ProjectManLanding from './pages/ProjectManLanding'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectManLanding />} />
    </Routes>
  )
}

export default App