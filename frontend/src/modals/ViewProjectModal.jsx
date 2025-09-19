import { useEffect } from 'react';
import {
    X,
    ClipboardList,
    CalendarDays,
    BarChart2,
    CheckCircle,
    Clock,
    Target,
    AlertCircle,
    Folder
} from 'lucide-react';

const ViewProjectModal = ({ isOpen, onClose, project }) => {

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);


    if (!isOpen || !project) return null;

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // Handles ISO strings and returns 'yyyy-mm-dd'
        return new Date(dateString).toISOString().slice(0, 10);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Active': return { icon: <Target className="w-4 h-4" />, color: 'text-green-600' };
            case 'Completed': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600' };
            case 'On Hold': return { icon: <Clock className="w-4 h-4" />, color: 'text-orange-600' };
            case 'Cancelled': return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600' };
            default: return { icon: <Folder className="w-4 h-4" />, color: 'text-gray-600' };
        }
    };

    const getPriorityInfo = (priority) => {
         switch (priority) {
            case 'Urgent': return '🔴 Urgent';
            case 'High': return '🟠 High';
            case 'Medium': return '🟡 Medium';
            case 'Low': return '🟢 Low';
            default: return priority;
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Project Details
                            </h2>
                            <p className="text-gray-300 text-xs mt-1">Viewing project information.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-4">
                        {/* Project Title */}
                        <div>
                            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Project Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={project.title}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-not-allowed"
                            />
                        </div>

                        {/* Project Description */}
                        <div>
                            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Project Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={project.description}
                                readOnly
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 resize-none cursor-not-allowed"
                            />
                        </div>

                        {/* Status and Priority Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Status
                                </label>
                                 <div className={`flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50`}>
                                    <span className={getStatusInfo(project.status).color}>{getStatusInfo(project.status).icon}</span>
                                    <span className="text-gray-800">{project.status}</span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Priority
                                </label>
                                 <input
                                    type="text"
                                    name="priority"
                                    id="priority"
                                    value={getPriorityInfo(project.priority)}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={formatDateForInput(project.startDate)}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="dueDate" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    value={formatDateForInput(project.dueDate)}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProjectModal;
