import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    Users,
    Target,
    Clock,
    CheckCircle,
    AlertCircle,
    Folder,
    Grid3x3,
    List,
    ArrowUpDown,
    Eye,
    Edit,
    Trash2,
    User,
    CalendarDays
} from 'lucide-react';

import NewProjectModal from '../modals/NewProjectModal';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const { user } = useAuth();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [newModalOpen, setnewModalOpen] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false); // 1. State to track if a refresh is needed

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            setError('Failed to fetch projects. Please try again.');
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Filter and sort projects (This useEffect will run automatically when `projects` state changes)
    useEffect(() => {
        let filtered = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Sort projects
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'priority':
                    const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    aValue = priorityOrder[a.priority] || 0;
                    bValue = priorityOrder[b.priority] || 0;
                    break;
                case 'dueDate':
                    aValue = new Date(a.dueDate);
                    bValue = new Date(b.dueDate);
                    break;
                default:
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProjects(filtered);
    }, [projects, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

    // 2. New handler for closing the modal that checks if a refetch is needed
    const handleCloseModal = () => {
        setnewModalOpen(false); // Close the modal
        if (needsRefresh) {
            fetchProjects(); // If a refresh was flagged, fetch the data
            setNeedsRefresh(false); // Reset the flag
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active': return <Target className="w-4 h-4" />;
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'On Hold': return <Clock className="w-4 h-4" />;
            case 'Inactive': return <AlertCircle className="w-4 h-4" />;
            default: return <Folder className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-50 border-green-200';
            case 'Completed': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'On Hold': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'text-red-600 bg-red-50 border-red-200';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `${diffDays} days left`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading projects...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Projects</h3>
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage and track all your projects</p>
                </div>
                <button
                    onClick={() => setnewModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                        </div>
                        <Folder className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-green-600">
                                {projects.filter(p => p.status === 'Active').length}
                            </p>
                        </div>
                        <Target className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {projects.filter(p => p.status === 'Completed').length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">On Hold</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {projects.filter(p => p.status === 'On Hold').length}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Priority</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="dueDate-asc">Due Date (Earliest)</option>
                            <option value="dueDate-desc">Due Date (Latest)</option>
                            <option value="priority-desc">Priority (High to Low)</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex border border-gray-300 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Display */}
            {filteredProjects.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {projects.length === 0
                            ? "Get started by creating your first project"
                            : "Try adjusting your search or filter criteria"
                        }
                    </p>
                    <button onClick={() => setnewModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Create Project</span>
                    </button>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project._id}
                                    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >

                                    <div className="p-6">
                                        {/* Title and Menu */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 pr-2">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status and Priority Row */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                {getStatusIcon(project.status)}
                                                <span className="capitalize">{project.status}</span>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                                {project.priority}
                                            </div>
                                        </div>

                                        {/* Due Date Section */}
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <CalendarDays className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-gray-900">Due: {formatDate(project.dueDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{getDaysUntilDue(project.dueDate)}</span>
                                            </div>
                                        </div>

                                        {/* Team Members */}
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded-lg">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{project.members.length}</span>
                                            <span>member{project.members.length !== 1 ? 's' : ''}</span>
                                            <span className='ml-auto cursor-pointer text-blue-600 text-sm font-medium 
             hover:text-blue-800 hover:underline transition-colors duration-200'>+ Add</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                            {project.members.includes(user.id) && <>
                                                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm cursor-pointer">
                                                    <Edit className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
             text-sm font-medium text-red-600 bg-red-100 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-600 hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>

                                            </>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredProjects.map((project) => (
                                            <tr key={project._id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                                        {getStatusIcon(project.status)}
                                                        <span>{project.status}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                                                        {project.priority}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{formatDate(project.dueDate)}</div>
                                                    <div className="text-xs text-gray-500">{getDaysUntilDue(project.dueDate)}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        <span>{project.members.length}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-2">
                                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
            <NewProjectModal
                isOpen={newModalOpen}
                onClose={handleCloseModal}
                onProjectCreated={() => setNeedsRefresh(true)}
            />
        </div>
    );
};

export default Projects;