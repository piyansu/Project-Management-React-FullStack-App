import React from 'react'
import { Routes, Route } from "react-router-dom";
import ProjectManLanding from './pages/ProjectManLanding'
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Layout from './layouts/Layout';
import { RouteProtect } from './middleware/RouteProtect';
import Projects from './pages/Projects';


const App = () => {
        return (
                <Routes>
                        <Route path="/" element={<ProjectManLanding />} />
                        <Route path="/login" element={<AuthPage />} />
                        {/* Parent Route */}
                        <Route path="/" element={<RouteProtect><Layout /></RouteProtect>}>
                                <Route path="dashboard" element={<RouteProtect><Dashboard /></RouteProtect>} />
                                <Route path="projects" element={<RouteProtect><Projects /></RouteProtect>} />
                        </Route>
                </Routes>
        )
}

export default App