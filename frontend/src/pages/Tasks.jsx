import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import { Calendar, Clock, Users, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function TasksPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');

    const filterOptions = ['All', 'In Progress', 'Completed', 'Pending', 'On Hold'];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch projects. Please try again later.');
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Completed': 'bg-green-100 text-green-800 border-green-200',
            'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'On Hold': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'High': 'bg-red-100 text-red-800 border-red-200',
            'Medium': 'bg-orange-100 text-orange-800 border-orange-200',
            'Low': 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const filteredProjects = projects.filter(project => {
        if (filter === 'All') return true;
        return project.status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Error Loading Projects</h2>
                    <p className="text-slate-600 text-center mb-6">{error}</p>
                    <button
                        onClick={fetchProjects}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg ml-auto">
                    {filterOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                filter === option
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/80'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200/80 mt-6">
                    <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects found for this filter</h3>
                    <p className="text-slate-500">Try selecting a different filter or adding a new project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map((project) => {
                        const daysLeft = getDaysRemaining(project.dueDate);
                        const isOverdue = daysLeft < 0;

                        return (
                            <Link
                                key={project._id}
                                to={`/tasks/${project._id}`}
                                // **MODIFICATION START**: Added hover:scale-[1.02] for a subtle zoom effect on the entire card
                                className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-slate-200/80 hover:scale-[1.02]"
                                // **MODIFICATION END**
                            >
                                {/* Project Image */}
                                <div className="h-40 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <img
                                        src={project.logo}
                                        alt={project.title}
                                        // **MODIFICATION START**: Removed group-hover:scale-105 and transition from the image
                                        className="w-full h-full object-cover"
                                        // **MODIFICATION END**
                                    />
                                </div>

                                {/* Project Content */}
                                <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 truncate group-hover:text-blue-600">
                                        {project.title}
                                    </h3>

                                    {/* Status and Priority */}
                                    <div className="flex gap-2 mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(project.priority)}`}>
                                            {project.priority}
                                        </span>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center text-xs text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            <span>{formatDate(project.startDate)}</span>
                                            <span className="mx-1.5">→</span>
                                            <span>{formatDate(project.dueDate)}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            {isOverdue ? (
                                                <span className="text-red-600 font-semibold">
                                                    {Math.abs(daysLeft)} days overdue
                                                </span>
                                            ) : daysLeft === 0 ? (
                                                <span className="text-orange-600 font-semibold">Due Today</span>
                                            ) : (
                                                <span className="text-slate-500 font-medium">
                                                    {daysLeft} days left
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Members (pushed to the bottom) */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Users className="w-4 h-4 mr-2 text-slate-400" />
                                            <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <span className="text-blue-600 group-hover:underline font-medium text-sm">
                                            View
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}