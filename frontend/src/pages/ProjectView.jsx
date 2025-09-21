import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar, Users, Clock, AlertCircle, CheckCircle2, Pause, XCircle, FileText, Briefcase,
    MoreVertical, ArrowUpCircle, ArrowDownCircle, Crown, Shield, UserCheck, Trash2, X, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const ProjectView = () => {
    const [project, setProject] = useState(null);
    const { user } = useAuth(); // Using the user from AuthContext
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const { projectId } = useParams();
    const navigate = useNavigate();

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

    const handleDeleteProject = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete the project.');
            }

            setIsDeleteModalOpen(false);
            navigate('/projects'); // Navigate to the projects list after successful deletion

        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

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

    // --- Modal Component ---
    const DeleteProjectModal = ({ isOpen, onClose, onConfirm, projectName, isDeleting, error }) => {
        const [inputValue, setInputValue] = useState('');
        const modalRef = useRef(null);

        if (!isOpen) return null;

        // Creates the required confirmation text, e.g., "My Awesome Project" -> "delete-my-awesome-project"
        const requiredConfirmationText = `delete-${projectName?.toLowerCase().replace(/\s+/g, '-') || 'project'}`;
        const isConfirmationMatch = inputValue === requiredConfirmationText;

        // Effect to handle closing the modal with the 'Escape' key
        useEffect(() => {
            const handleEsc = (event) => {
                if (event.key === 'Escape' && !isDeleting) {
                    onClose();
                }
            };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }, [onClose, isDeleting]);

        // Effect to handle closing the modal by clicking outside of it
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target) && !isDeleting) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [onClose, isDeleting]);

        // Reset input value when the modal is reopened for a new project
        useEffect(() => {
            if (isOpen) {
                setInputValue('');
            }
        }, [isOpen, projectName]);

        // Prevent body scroll when modal is open
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, [isOpen]);

        /**
         * Handles the confirmation click.
         * It calls the async onConfirm prop and reloads the page on success.
         */
        const handleConfirmDelete = async () => {
            if (!isConfirmationMatch || isDeleting) return;

            try {
                // Await the onConfirm promise from the parent component
                await onConfirm();

                // On successful deletion, reload the page
                window.location.reload();
            } catch (e) {
                // Errors are expected to be handled by the parent component,
                // which passes the `error` prop.
                console.error("Delete action failed:", e);
            }
        };

        const handleInputChange = (e) => {
            setInputValue(e.target.value);
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && isConfirmationMatch && !isDeleting) {
                handleConfirmDelete();
            }
        };

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop with blur effect */}
                <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md transition-all duration-300 ease-out" />

                {/* Modal container */}
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div
                        ref={modalRef}
                        className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-lg border border-gray-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header */}
                        <div className="bg-white px-6 pt-6 pb-4">
                            <div className="flex items-center">
                                <div className="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-50 border-2 border-red-100">
                                    <AlertTriangle className="h-7 w-7 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <h3
                                    className="text-2xl font-bold leading-6 text-gray-900"
                                    id="delete-modal-title"
                                >
                                    Delete Project
                                </h3>
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        You are about to permanently delete{' '}
                                        <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                            {projectName}
                                        </span>
                                        . This action cannot be undone and all associated data will be lost forever.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="bg-gray-50 px-6 py-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To confirm deletion, type the following text exactly:
                                    </label>
                                    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-3 font-mono text-center shadow-inner">
                                        <span className="text-red-600 font-semibold select-all text-base tracking-wide">
                                            {requiredConfirmationText}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className={`block w-full px-4 py-3 border-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 font-mono text-base ${inputValue && !isConfirmationMatch
                                                ? 'border-red-300 bg-red-50 focus:border-red-500'
                                                : inputValue && isConfirmationMatch
                                                    ? 'border-green-300 bg-green-50 focus:border-green-500'
                                                    : 'border-gray-300 bg-white focus:border-red-500'
                                                }`}
                                            placeholder="Type the confirmation text..."
                                            autoFocus
                                            disabled={isDeleting}
                                        />
                                        {inputValue && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {isConfirmationMatch ? (
                                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex">
                                            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                            <div className="ml-3">
                                                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                                                <div className="text-sm text-red-700 mt-1">{error}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isDeleting}
                                className="mt-3 sm:mt-0 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={!isConfirmationMatch || isDeleting}
                                className="inline-flex w-full justify-center items-center rounded-lg border border-transparent bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:bg-red-300 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Project'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
            {/* Delete Section */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-rose-900 mb-2">Delete Project</h3>
                <p className="text-sm text-rose-800 mb-4">
                    Once you delete this project, there is no going back. Please be certain.
                </p>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete this Project
                </button>
            </div>
        </div>
    );

    // ✨ MODIFIED COMPONENT
    const UserAvatar = ({ user }) => {
        // Handle case where user data is not yet loaded
        if (!user || !user.fullName) {
            return <div className="w-12 h-12 rounded-full flex-shrink-0 bg-slate-200 animate-pulse"></div>;
        }

        // If a profile photo exists, display it
        if (user.profilePhoto) {
            return (
                <img
                    src={user.profilePhoto}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-white shadow-sm"
                />
            );
        }

        // Fallback to initials if no profile photo
        const initials = user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const getHashCode = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        };
        const colors = ['bg-blue-200 text-blue-800', 'bg-emerald-200 text-emerald-800', 'bg-amber-200 text-amber-800', 'bg-rose-200 text-rose-800', 'bg-indigo-200 text-indigo-800', 'bg-purple-200 text-purple-800', 'bg-pink-200 text-pink-800'];
        const color = colors[Math.abs(getHashCode(user.fullName)) % colors.length];

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
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg cursor-pointer"
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

    // ✨ MODIFIED COMPONENT
    const UserCard = ({ user, loading, error, role, isOwner, children }) => {
        if (loading) {
            return (
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-4 animate-pulse">
                    <div className="w-6 h-12 rounded-full bg-slate-200"></div>
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

        return (
            <div className="group bg-white p-5 pt-5 pb-5 pr-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 max-w-xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                        {/* The call to UserAvatar is now updated */}
                        <UserAvatar user={user} />
                        <div className="overflow-hidden flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <p className="text-base font-semibold text-slate-900 truncate" title={user.fullName}>
                                    {user.fullName}
                                </p>
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

                {/* Project Owner Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <Crown className="w-6 h-6 text-amber-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Project Owner</h3>
                        </div>
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
                            </div>
                        </div>
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
                        </div>
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

    const getProjectAvatarColor = (projectName) => {
        if (!projectName) return 'bg-slate-200 text-slate-800';
        const getHashCode = (str) => {
            let hash = 0;
            if (str.length === 0) return hash;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200',
            'bg-emerald-100 text-emerald-800 border-emerald-200',
            'bg-amber-100 text-amber-800 border-amber-200',
            'bg-rose-100 text-rose-800 border-rose-200',
            'bg-indigo-100 text-indigo-800 border-indigo-200',
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-pink-100 text-pink-800 border-pink-200'
        ];
        return colors[Math.abs(getHashCode(projectName)) % colors.length];
    };

    // --- Main Component Render ---
    return (
        <div className="space-y-6 pb-10">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start space-x-5">
                    {/* Project Avatar - UPDATED SECTION */}
                    {project.logo ? (
                        <img
                            src={project.logo}
                            alt={`${project.title} logo`}
                            className="w-20 h-20 rounded-xl flex-shrink-0 object-cover border border-slate-200" // Increased size
                        />
                    ) : (
                        <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center border ${getProjectAvatarColor(project.title)}`}>
                            <span className="text-2xl font-bold">
                                {project.title.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Project Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.title}</h1>
                        <div className="flex items-center flex-wrap gap-2">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(project.status)}`}>
                                {getStatusIcon(project.status)}
                                <span className="ml-2">{project.status}</span>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getPriorityColor(project.priority)}`}>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {project.priority} Priority
                            </div>
                        </div>
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

            <DeleteProjectModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteError(null);
                }}
                onConfirm={handleDeleteProject}
                projectName={project.title}
                isDeleting={isDeleting}
                error={deleteError}
            />
        </div>
    );
};

export default ProjectView;