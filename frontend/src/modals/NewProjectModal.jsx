import { useState, useEffect } from 'react';
import {
    Plus,
    CheckCircle,
    AlertCircle,
    X
} from 'lucide-react';

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        status: 'Active',
        priority: 'Medium',
        startDate: '',
        dueDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false); // State to track successful submission

    // Effect to auto-close the modal after success message is shown
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onClose(); // Close the modal
            }, 2000); // Wait for 2 seconds

            // Cleanup the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onClose]);

    // Reset state when modal is closed to ensure it's fresh when reopened
    useEffect(() => {
        if (!isOpen) {
            setProjectData({
                title: '',
                description: '',
                status: 'Active',
                priority: 'Medium',
                startDate: '',
                dueDate: ''
            });
            setError(null);
            setIsSubmitting(false);
            setIsSuccess(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Basic validation
        if (!projectData.title || !projectData.startDate) {
            setError("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            ...projectData,
            startDate: new Date(projectData.startDate).toISOString(),
            dueDate: projectData.dueDate ? new Date(projectData.dueDate).toISOString() : null

        };

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIsSuccess(true);
            setTimeout(() => window.location.reload(), 1500);
            if (onProjectCreated) {
                onProjectCreated();
            }

        } catch (error) {
            setError('Failed to create project. Please try again.');
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isSuccess ? onClose : undefined} // Prevent closing on backdrop click during success animation
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Create New Project</h2>
                            <p className="text-blue-100 text-xs mt-1">Fill in the details below to start a new project.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5 " />
                        </button>
                    </div>
                </div>

                {isSuccess ? (
                    // Success Message View
                    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
                        <div className="p-4 bg-green-100 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-gray-900">Success!</h3>
                        <p className="mt-2 text-gray-600">Your project has been created successfully.</p>
                    </div>
                ) : (
                    // Form View
                    <>
                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
                            <div className="space-y-4">
                                {/* Project Title */}
                                <div>
                                    <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Project Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={projectData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Q4 Marketing Campaign"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                        value={projectData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Briefly describe the project..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    />
                                </div>

                                {/* Status and Priority Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="status" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            value={projectData.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white cursor-pointer"
                                        >
                                            <option value="Active">🟢 Active</option>
                                            <option value="Completed">✅ Completed</option>
                                            <option value="On Hold">⏸️ On Hold</option>
                                            <option value="Cancelled">❌ Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            id="priority"
                                            value={projectData.priority}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white cursor-pointer"
                                        >
                                            <option value="Urgent">🔴 Urgent</option>
                                            <option value="High">🟠 High</option>
                                            <option value="Medium">🟡 Medium</option>
                                            <option value="Low">🟢 Low</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            id="startDate"
                                            value={projectData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
                                            value={projectData.dueDate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                                        <div className="flex items-center">
                                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                            <p className="text-red-800 text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-5 py-2 flex items-center justify-center bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Plus className="w-4 h-4 mr-1.5" />
                                            <span>Create Project</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewProjectModal;