import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Calendar, Users, User, Clock, AlertCircle, CheckCircle2, Pause, XCircle, FileText, Briefcase } from 'lucide-react';

const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // State to manage active tab

    const { projectId } = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    // --- Helper Functions (retained from original code) ---
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active':
                return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            case 'Completed':
                return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
            case 'On Hold':
                return <Pause className="w-4 h-4 text-amber-600" />;
            case 'Cancelled':
                return <XCircle className="w-4 h-4 text-rose-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
        });
    };

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center shadow-sm">
                <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Project</h2>
                <p className="text-slate-600">{error}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
                <p className="text-slate-600">The requested project could not be found.</p>
            </div>
        );
    }

    // --- Tab Content Components ---
    const InfoTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Description & ID */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-blue-600" />
                        Description
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                        {project.description || 'No description provided.'}
                    </p>
                </div>
            </div>
            {/* Right Column: Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    Timeline
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">Start Date</span>
                        <span className="text-slate-900 font-medium">{formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">Due Date</span>
                        <span className="text-slate-900 font-medium">{formatDate(project.dueDate)}</span>
                    </div>
                    <div className="border-t border-slate-100 my-4"></div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-500">Created</span>
                        <span className="text-slate-600">{formatTimestamp(project.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-500">Last Updated</span>
                        <span className="text-slate-600">{formatTimestamp(project.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const MembersTab = () => (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="space-y-6">
                {/* Owner */}
                <div>
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 mr-3 text-blue-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Owner</h3>
                    </div>
                    <div>
                        <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {project.ownerId}
                        </span>
                    </div>
                </div>
                <div className="border-t border-slate-100"></div>
                {/* Administrators */}
                <div>
                    <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 mr-3 text-purple-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Administrators ({project.admins.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.admins.map((admin, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {admin}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="border-t border-slate-100"></div>
                {/* Members */}
                <div>
                    <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 mr-3 text-slate-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Members ({project.members.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.members.map((member, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200">
                                {member}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const WorksTab = () => (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Project Works</h3>
            <p className="text-slate-600">
                Tasks, deliverables, and other work items for this project will be displayed here.
            </p>
        </div>
    );

    // --- Main Component Render ---
    return (
        <div className="space-y-6 pb-10">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{project.title}</h1>
                <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-2">{project.status}</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border ${getPriorityColor(project.priority)}`}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {project.priority} Priority
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'info'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Info
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'members'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('works')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'works'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Works
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'info' && <InfoTab />}
                {activeTab === 'members' && <MembersTab />}
                {activeTab === 'works' && <WorksTab />}
            </div>
        </div>
    );
};

export default ProjectView;