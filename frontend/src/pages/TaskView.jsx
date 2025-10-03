import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar, Plus, MoreHorizontal, User, Tag, CheckCircle, 
    Clock, XCircle, Loader, AlertCircle, MessageSquare, 
    Edit, Trash2, ChevronsLeft, ChevronsRight 
} from 'lucide-react';

// ++ FINAL CORRECTED COMPONENT ++
const AssigneeAvatar = ({ assigneeId }) => {
    const [assignee, setAssignee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Reset state when the assigneeId prop changes
        setAssignee(null);
        setImageError(false);
        setLoading(true);

        if (!assigneeId) {
            setLoading(false);
            return;
        }

        const fetchAssigneeData = async () => {
            try {
                // Directly use the assigneeId for the fetch URL
                const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/${assigneeId}`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setAssignee(data); // Store the entire fetched user object
                } else {
                    console.error(`Failed to fetch assignee with ID: ${assigneeId}`);
                }
            } catch (error) {
                console.error("Error fetching assignee data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssigneeData();
    }, [assigneeId]); // The effect runs when the ID changes

    const getAvatarColor = (name) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
        if (!name) return colors[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    if (loading) {
        return <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse"></div>;
    }
    
    if (!assignee) {
        return (
             <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold shadow-sm" title="Unassigned">?</div>
        );
    }

    if (assignee.profilePhoto && !imageError) {
        return (
            <img
                src={assignee.profilePhoto}
                alt={assignee.fullName}
                title={`Assigned to: ${assignee.fullName}`}
                className="w-7 h-7 rounded-full object-cover shadow-sm"
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div 
            className={`w-7 h-7 rounded-full ${getAvatarColor(assignee.fullName)} flex items-center justify-center text-white text-xs font-bold shadow-sm`} 
            title={`Assigned to: ${assignee.fullName}`}
        >
            {assignee.fullName ? assignee.fullName.charAt(0).toUpperCase() : '?'}
        </div>
    );
};


const TaskView = () => {
    const projectId = window.location.pathname.split('/').pop() || 'your-project-id';

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapsedColumns, setCollapsedColumns] = useState({});

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}/tasks`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const toggleColumn = (title) => {
        setCollapsedColumns(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'To Do': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPriorityLabel = (priority) => {
        const colors = {
            'Urgent': 'text-red-600 bg-red-50 border-red-200',
            'High': 'text-orange-600 bg-orange-50 border-orange-200',
            'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
            'Low': 'text-emerald-600 bg-emerald-50 border-emerald-200'
        };
        return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'Done' || status === 'Cancelled') return false;
        return new Date(dueDate) < new Date();
    };

    const TaskCard = ({ task }) => {
        const overdue = isOverdue(task.dueDate, task.status);
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const dropdownRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setDropdownOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [dropdownRef]);
        
        return (
            <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                            {task.title}
                        </h3>
                    </div>
                    <div className="relative flex-shrink-0" ref={dropdownRef}>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(prev => !prev);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1">
                                <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Edit size={14} />
                                    <span>Edit</span>
                                </button>
                                <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityLabel(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>

                {/* ++ UPDATED LINE BELOW ++ */}
                <div className="flex items-center flex-wrap gap-x-7 gap-y-2">
                    {task.startDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock size={13} className="text-gray-400 flex-shrink-0" />
                            <span className="font-medium">Start:</span>
                            <span>{formatDateShort(task.startDate)}</span>
                        </div>
                    )}
                    {task.dueDate && (
                        <div className={`flex items-center gap-2 text-xs ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                            <Calendar size={13} className={`${overdue ? 'text-red-500' : 'text-gray-400'} flex-shrink-0`} />
                            <span className="font-medium">Due:</span>
                            <span className={overdue ? 'font-semibold' : ''}>{formatDateShort(task.dueDate)}</span>
                            {overdue && <AlertCircle size={13} className="text-red-500" />}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Assigned to :</span>
                            <AssigneeAvatar assigneeId={task.assignedTo} />
                        </div>
                    ) : (
                        <div></div> 
                    )}
                </div>
            </div>
        );
    };

    const Column = ({ title, status, icon, iconColor, isCollapsed, onToggleCollapse }) => {
        const columnTasks = tasks.filter(task => task.status === status);

        if (isCollapsed) {
            return (
                <div 
                    onClick={onToggleCollapse}
                    className="flex-shrink-0 w-16 h-[calc(100vh-220px)] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-between py-4 px-2 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className={`${iconColor} p-1.5 rounded-lg`}>
                            {icon}
                        </div>
                        <span className="bg-gray-200 text-gray-700 text-xs font-semibold w-8 h-6 flex items-center justify-center rounded-full">
                            {columnTasks.length}
                        </span>
                    </div>
                    <div style={{ writingMode: 'vertical-rl' }} className="transform rotate-180 text-gray-800 font-semibold text-sm whitespace-nowrap my-4">
                        {title}
                    </div>
                    <div className="text-gray-400">
                        <ChevronsRight size={18} />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-shrink-0 w-85 transition-all duration-300">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <div className={`${iconColor} p-1.5 rounded-lg`}>
                                {icon}
                            </div>
                            <h2 className="text-gray-900 font-semibold text-sm">{title}</h2>
                            <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {columnTasks.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* ++ UPDATED: Added cursor-pointer class ++ */}
                            <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-lg transition-colors cursor-pointer">
                                <Plus size={16} />
                            </button>
                            {/* ++ UPDATED: Added cursor-pointer class ++ */}
                            <button onClick={onToggleCollapse} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-lg transition-colors cursor-pointer">
                                <ChevronsLeft size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-3 h-[calc(100vh-280px)] overflow-y-auto">
                        {columnTasks.length > 0 ? (
                            columnTasks.map(task => (
                                <TaskCard key={task._id} task={task} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                    {icon}
                                </div>
                                <p className="text-sm text-center">No tasks yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Loading your board...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
                <div className="bg-white border border-red-200 rounded-xl p-8 text-center max-w-md shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Board</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchTasks}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        // ++ UPDATED: Added bottom padding 'pb-8' to the main container ++
        <div className="pb-8">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 8px;
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9; /* slate-100 */
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #94a3b8; /* slate-400 */
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #64748b; /* slate-500 */
                }
            `}</style>
        
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Total Tasks : <span className="text-2xl font-bold text-gray-900">{tasks.length}</span></p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium shadow-sm hover:shadow cursor-pointer">
                    <Plus size={18} />
                    <span>New Task</span>
                </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                <Column
                    title="To Do"
                    status="To Do"
                    icon={<Clock className="w-4 h-4 text-amber-600" />}
                    iconColor="bg-amber-100"
                    isCollapsed={collapsedColumns['To Do']}
                    onToggleCollapse={() => toggleColumn('To Do')}
                />
                <Column
                    title="In Progress"
                    status="In Progress"
                    icon={<Loader className="w-4 h-4 text-blue-600" />}
                    iconColor="bg-blue-100"
                    isCollapsed={collapsedColumns['In Progress']}
                    onToggleCollapse={() => toggleColumn('In Progress')}
                />
                <Column
                    title="Done"
                    status="Done"
                    icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
                    iconColor="bg-emerald-100"
                    isCollapsed={collapsedColumns['Done']}
                    onToggleCollapse={() => toggleColumn('Done')}
                />
                <Column
                    title="Cancelled"
                    status="Cancelled"
                    icon={<XCircle className="w-4 h-4 text-red-600" />}
                    iconColor="bg-red-100"
                    isCollapsed={collapsedColumns['Cancelled']}
                    onToggleCollapse={() => toggleColumn('Cancelled')}
                />
            </div>
        </div>
    );
};

export default TaskView;