import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import {
    Calendar, Users, User, Clock, AlertCircle, CheckCircle2, Pause, XCircle, FileText, Briefcase,
    MoreVertical, ArrowUpCircle, ArrowDownCircle, Crown, Shield, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const ProjectView = () => {
    const [project, setProject] = useState(null);
    const { user } = useAuth(); // Using the user from AuthContext
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

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

    // --- Helper Functions ---
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
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
                    <div className="bg-emerald-100 flex-shrink-0 p-3 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Start Date</p>
                        <p className="text-lg font-semibold text-slate-900">{formatDate(project.startDate)}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
                    <div className="bg-rose-100 flex-shrink-0 p-3 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-rose-700" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Due Date</p>
                        <p className="text-lg font-semibold text-slate-900">{formatDate(project.dueDate)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-blue-600" />
                        Description
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                        {project.description || 'No description has been provided for this project.'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" />
                        Activity
                    </h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex justify-between items-center">
                            <span className="font-medium text-slate-600">Created</span>
                            <span className="text-slate-800 font-medium text-right">{formatTimestamp(project.createdAt)}</span>
                        </li>
                        <div className="border-t border-slate-100"></div>
                        <li className="flex justify-between items-center">
                            <span className="font-medium text-slate-600">Last Updated</span>
                            <span className="text-slate-800 font-medium text-right">{formatTimestamp(project.updatedAt)}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const UserAvatar = ({ fullName }) => {
        if (!fullName) return null;
        const initials = fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const getHashCode = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        };
        const colors = ['bg-blue-200 text-blue-800', 'bg-emerald-200 text-emerald-800', 'bg-amber-200 text-amber-800', 'bg-rose-200 text-rose-800', 'bg-indigo-200 text-indigo-800', 'bg-purple-200 text-purple-800', 'bg-pink-200 text-pink-800'];
        const color = colors[Math.abs(getHashCode(fullName)) % colors.length];
        return (
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${color}`}>
                <span className="text-lg font-bold">{initials}</span>
            </div>
        );
    };

    const UserActionMenu = ({ user, role, onPromote, onDemote }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const menuRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleAction = async () => {
            setIsSubmitting(true);
            try {
                if (role === 'admin') await onDemote(user); else await onPromote(user);
                setIsOpen(false);
            } catch (error) {
                console.error(`Failed to ${role === 'admin' ? 'demote' : 'promote'} user:`, error);
            } finally {
                setIsSubmitting(false);
            }
        };

        const actionText = role === 'admin' ? 'Demote to member' : 'Promote to admin';
        const ActionIcon = role === 'admin' ? ArrowDownCircle : ArrowUpCircle;

        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="User actions"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
                {isOpen && (
                    <div className="absolute right-0 top-10 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                        <button
                            onClick={handleAction}
                            disabled={isSubmitting}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
                        >
                            {isSubmitting
                                ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-slate-600 mr-3"></div>
                                : <ActionIcon className="w-4 h-4 mr-3" />
                            }
                            <span>{isSubmitting ? 'Processing...' : actionText}</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const UserCard = ({ user, loading, error, role, isOwner, children }) => {
        if (loading) {
            return (
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            );
        }
        if (error || !user) {
            return (
                <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-rose-200">
                        <AlertCircle className="w-6 h-6 text-rose-700" />
                    </div>
                    <div>
                        <p className="font-semibold text-rose-900">Failed to load user</p>
                        <p className="text-sm text-rose-700">{error || 'User data not found.'}</p>
                    </div>
                </div>
            );
        }

        const getRoleInfo = () => {
            if (isOwner) return { icon: Crown, color: 'text-amber-600', label: 'Owner' };
            if (role === 'admin') return { icon: Shield, color: 'text-purple-600', label: 'Admin' };
            return { icon: UserCheck, color: 'text-slate-600', label: 'Member' };
        };

        const { icon: RoleIcon, color: roleColor, label: roleLabel } = getRoleInfo();

        return (
            <div className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                        <UserAvatar fullName={user.fullName} />
                        <div className="overflow-hidden flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <p className="text-base font-semibold text-slate-900 truncate" title={user.fullName}>
                                    {user.fullName}
                                </p>
                                <div className="flex items-center space-x-1">
                                    <RoleIcon className={`w-4 h-4 ${roleColor}`} />
                                    <span className={`text-xs font-medium ${roleColor}`}>{roleLabel}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 truncate" title={user.email}>{user.email}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    const MembersTab = ({ project, setProject, authUser }) => {
        const [userDetails, setUserDetails] = useState({});
        const [loadingMembers, setLoadingMembers] = useState(true);
        const [errorMembers, setErrorMembers] = useState(null);

        useEffect(() => {
            const fetchUsers = async () => {
                if (!project) return;
                setLoadingMembers(true);
                setErrorMembers(null);
                const allUserIds = [project.ownerId, ...project.admins, ...project.members];
                const uniqueUserIds = [...new Set(allUserIds.filter(id => id))];
                try {
                    const userPromises = uniqueUserIds.map(async (userId) => {
                        const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/${userId}`, { credentials: 'include' });
                        if (!response.ok) {
                            console.error(`Failed to fetch user ${userId}`);
                            return { id: userId, data: null, error: `Status ${response.status}` };
                        }
                        const data = await response.json();
                        return { id: userId, data };
                    });
                    const results = await Promise.all(userPromises);
                    const usersMap = results.reduce((acc, { id, data }) => { if (data) acc[id] = data; return acc; }, {});
                    setUserDetails(usersMap);
                } catch (err) {
                    setErrorMembers(err.message);
                } finally {
                    setLoadingMembers(false);
                }
            };
            fetchUsers();
        }, [project]);

        const isCurrentUserAdmin = authUser && project.admins.includes(authUser.id);

        const handleDemote = async (userToDemote) => {
            console.log('Attempting to demote user:', userToDemote);

            if (!userToDemote || !userToDemote.id) {
                console.error('Demotion failed: Invalid or incomplete user object provided.', userToDemote);
                return;
            }

            console.log(`Project state BEFORE demotion:`, {
                admins: project.admins,
                members: project.members
            });

            try {
                const apiUrl = `${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}/admins/${userToDemote.id}`;

                console.log('Sending DELETE request to API endpoint:', apiUrl);

                const resRemoveAdmin = await fetch(apiUrl, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                console.log('API Response Status:', resRemoveAdmin.status);

                if (!resRemoveAdmin.ok) {
                    const errorBody = await resRemoveAdmin.text();
                    console.error('API Error Response Body:', errorBody);
                    throw new Error(`Failed to remove user from admins. Status: ${resRemoveAdmin.status}`);
                }

                console.log('User successfully removed from admins via API call.');

                setProject(prev => {
                    const newAdmins = prev.admins.filter(id => id !== userToDemote.id);
                    const newMembers = [...new Set([...prev.members, userToDemote.id])];

                    console.log('Updating local component state to:', { newAdmins, newMembers });

                    return {
                        ...prev,
                        admins: newAdmins,
                        members: newMembers
                    };
                });

            } catch (error) {
                console.error('A critical error occurred during the demotion process:', error);
            }
        };

        const handlePromote = async (userToPromote) => {
            const resAddAdmin = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}/admins`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userToPromote.email }) });
            if (!resAddAdmin.ok) throw new Error('Failed to promote user to admin.');

            setProject(prev => ({ ...prev, admins: [...new Set([...prev.admins, userToPromote.id])], members: prev.members.filter(id => id !== userToPromote.id) }));
        };

        if (errorMembers) {
            return (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center shadow-sm">
                    <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Team Members</h3>
                    <p className="text-slate-600">{errorMembers}</p>
                </div>
            );
        }

        const filteredAdmins = project.admins.filter(adminId => adminId !== project.ownerId);
        const filteredMembers = project.members.filter(memberId => memberId !== project.ownerId && !project.admins.includes(memberId));

        const totalMembers = 1 + filteredAdmins.length + filteredMembers.length; // +1 for owner

        return (
            <div className="space-y-8">
                {/* Team Overview Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">Team Members</h2>
                            <p className="text-sm text-slate-600">
                                Manage project access and permissions for {totalMembers} team member{totalMembers !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm border border-blue-200">
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">{totalMembers}</div>
                                <div className="text-xs text-slate-600">Total Members</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Owner Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <Crown className="w-6 h-6 text-amber-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Project Owner</h3>
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                Full Access
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                            Has complete control over the project and all team members
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="max-w-2xl">
                            <UserCard
                                user={userDetails[project.ownerId]}
                                loading={loadingMembers}
                                error={!userDetails[project.ownerId] && !loadingMembers ? 'Owner details not found.' : null}
                                isOwner={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Administrators Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-6 h-6 text-purple-600" />
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Administrators
                                    <span className="ml-2 text-base font-normal text-slate-500">
                                        ({filteredAdmins.length})
                                    </span>
                                </h3>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                    Manage Members
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                            Can manage project settings and promote/demote team members
                        </p>
                    </div>
                    <div className="p-6">
                        {filteredAdmins.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {loadingMembers ?
                                    Array.from({ length: filteredAdmins.length }).map((_, i) =>
                                        <UserCard key={i} loading={true} />
                                    ) :
                                    filteredAdmins.map(id => {
                                        const shouldShowMenu = isCurrentUserAdmin && userDetails[id] && authUser.id !== id;
                                        return (
                                            <UserCard
                                                key={id}
                                                user={userDetails[id]}
                                                loading={false}
                                                error={!userDetails[id] ? 'Details not found.' : null}
                                                role="admin"
                                            >
                                                {shouldShowMenu && (
                                                    <UserActionMenu
                                                        user={userDetails[id]}
                                                        role="admin"
                                                        onDemote={handleDemote}
                                                    />
                                                )}
                                            </UserCard>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600">No administrators assigned</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Promote members to administrators to help manage the project
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <Users className="w-6 h-6 text-slate-600" />
                            <h3 className="text-lg font-semibold text-slate-900">
                                Members
                                <span className="ml-2 text-base font-normal text-slate-500">
                                    ({filteredMembers.length})
                                </span>
                            </h3>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                View & Contribute
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                            Can view project details and contribute to project tasks
                        </p>
                    </div>
                    <div className="p-6">
                        {filteredMembers.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {loadingMembers ?
                                    Array.from({ length: filteredMembers.length }).map((_, i) =>
                                        <UserCard key={i} loading={true} />
                                    ) :
                                    filteredMembers.map(id => {
                                        const shouldShowMenu = isCurrentUserAdmin && userDetails[id];
                                        return (
                                            <UserCard
                                                key={id}
                                                user={userDetails[id]}
                                                loading={false}
                                                error={!userDetails[id] ? 'Details not found.' : null}
                                                role="member"
                                            >
                                                {shouldShowMenu && (
                                                    <UserActionMenu
                                                        user={userDetails[id]}
                                                        role="member"
                                                        onPromote={handlePromote}
                                                    />
                                                )}
                                            </UserCard>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600">No members assigned</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Invite team members to collaborate on this project
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const WorksTab = () => (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Project Works</h3>
            <p className="text-slate-600">Tasks, deliverables, and other work items for this project will be displayed here.</p>
        </div>
    );

    // --- Main Component Render ---
    return (
        <div className="space-y-6 pb-10">
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
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('info')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Info</button>
                    <button onClick={() => setActiveTab('members')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${activeTab === 'members' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Members</button>
                    <button onClick={() => setActiveTab('works')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${activeTab === 'works' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Works</button>
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'info' && <InfoTab />}
                {activeTab === 'members' && <MembersTab project={project} setProject={setProject} authUser={user} />}
                {activeTab === 'works' && <WorksTab />}
            </div>
        </div>
    );
};

export default ProjectView;