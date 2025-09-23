// App.jsx

import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext'; // Import useAuth
import { SocketProvider } from './context/SocketContext'; // Import SocketProvider
import ProjectManLanding from './pages/ProjectManLanding';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Layout from './layouts/Layout';
import { RouteProtect } from './middleware/RouteProtect';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView';
import ProfilePage from './pages/ProfilePage';
import SocialDashboard from './pages/SocialDashboard';

const App = () => {
    // Correctly call the hook inside the component to get the user
    const { user } = useAuth();

    // Wrap all routes with the SocketProvider, passing it the user's ID
    return (
        <SocketProvider userId={user?.id}>
            <Routes>
                <Route path="/" element={<ProjectManLanding />} />
                <Route path="/login" element={<AuthPage />} />
                {/* Parent Route */}
                <Route path="/" element={<RouteProtect><Layout /></RouteProtect>}>
                    <Route path="dashboard" element={<RouteProtect><Dashboard /></RouteProtect>} />
                    <Route path="projects" element={<RouteProtect><Projects /></RouteProtect>} />
                    <Route path="projects/:projectId" element={<RouteProtect><ProjectView /></RouteProtect>} />
                    <Route path="profile" element={<RouteProtect><ProfilePage /></RouteProtect>} />
                    <Route path="coworkers" element={<RouteProtect><SocialDashboard /></RouteProtect>} />
                </Route>
            </Routes>
        </SocketProvider>
    );
};

export default App;