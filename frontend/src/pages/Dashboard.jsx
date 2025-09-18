import { useState , useEffect} from 'react';
import {
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    MoreHorizontal,
    Filter,
    Search,
    Target,
    FolderOpen,
    User,
    X
} from 'lucide-react';

import NewProjectModal from '../modals/NewProjectModal';

const Dashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('This Week');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data - replace with your actual data
    const stats = [
        {
            title: 'Total Tasks',
            value: '247',
            change: '+12%',
            changeType: 'increase',
            icon: Target,
            color: 'blue'
        },
        {
            title: 'Completed',
            value: '189',
            change: '+8%',
            changeType: 'increase',
            icon: CheckCircle,
            color: 'green'
        },
        {
            title: 'In Progress',
            value: '43',
            change: '+23%',
            changeType: 'increase',
            icon: Clock,
            color: 'orange'
        },
        {
            title: 'Overdue',
            value: '15',
            change: '-5%',
            changeType: 'decrease',
            icon: AlertCircle,
            color: 'red'
        }
    ];

    const recentTasks = [
        {
            id: 1,
            title: 'Design system documentation',
            project: 'ProjectMan UI',
            assignee: 'Sarah J.',
            priority: 'High',
            status: 'In Progress',
            dueDate: '2025-09-18',
            progress: 75
        },
        {
            id: 2,
            title: 'User authentication flow',
            project: 'Backend API',
            assignee: 'Mike R.',
            priority: 'Medium',
            status: 'Review',
            dueDate: '2025-09-20',
            progress: 90
        },
        {
            id: 3,
            title: 'Mobile app wireframes',
            project: 'Mobile App',
            assignee: 'Lisa K.',
            priority: 'High',
            status: 'In Progress',
            dueDate: '2025-09-19',
            progress: 45
        },
        {
            id: 4,
            title: 'Database optimization',
            project: 'Backend API',
            assignee: 'Tom L.',
            priority: 'Low',
            status: 'Completed',
            dueDate: '2025-09-16',
            progress: 100
        },
        {
            id: 5,
            title: 'Landing page redesign',
            project: 'Marketing Site',
            assignee: 'Anna M.',
            priority: 'Medium',
            status: 'Planning',
            dueDate: '2025-09-22',
            progress: 20
        }
    ];

    const upcomingDeadlines = [
        { task: 'Mobile app wireframes', project: 'Mobile App', dueDate: '2025-09-19', priority: 'High' },
        { task: 'Design system documentation', project: 'ProjectMan UI', dueDate: '2025-09-18', priority: 'High' },
        { task: 'User authentication flow', project: 'Backend API', dueDate: '2025-09-20', priority: 'Medium' },
        { task: 'Landing page redesign', project: 'Marketing Site', dueDate: '2025-09-22', priority: 'Medium' }
    ];

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-orange-600 bg-orange-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-green-600 bg-green-50';
            case 'in progress': return 'text-blue-600 bg-blue-50';
            case 'review': return 'text-purple-600 bg-purple-50';
            case 'planning': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return `${diffDays} days`;
    };

    return (
        <>
            <div className={`space-y-6 pb-10 transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Quarter</option>
                        </select>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                                        <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Tasks */}
                    <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                                        />
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                        <Filter className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentTasks.filter(task =>
                                    task.title.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((task) => (
                                    <div key={task.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <FolderOpen className="w-4 h-4" />
                                                        <span>{task.project}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <User className="w-4 h-4" />
                                                        <span>{task.assignee}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(task.dueDate)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="text-gray-900 font-medium">{task.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${task.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Upcoming Deadlines */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {upcomingDeadlines.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.task}</p>
                                                <p className="text-xs text-gray-600">{item.project}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-900 font-medium">{formatDate(item.dueDate)}</p>
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                                                    {item.priority}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Dashboard;