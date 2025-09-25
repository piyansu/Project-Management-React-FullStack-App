import React, { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, AlertTriangle, Check } from 'lucide-react';
import PropTypes from 'prop-types';

const AddUserModal = ({ isOpen, onClose, roleToAdd, projectId, onUserAdded }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const modalRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const title = roleToAdd === 'admin' ? 'Add Administrator' : 'Add Team Member';
    const buttonText = roleToAdd === 'admin' ? 'Add Administrator' : 'Add Member';
    const subtitle = roleToAdd === 'admin'
        ? 'Grant administrative privileges to a user for this project.'
        : 'Add a new team member to collaborate on this project.';

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setSearchTerm('');
            setSelectedUser(null);
            setSubmitError(null);
            setFetchError(null);
            setIsDropdownOpen(false);

            // Focus the search input when modal opens
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 100);

            const fetchUsers = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}/non-members`, {
                        method: 'GET', // Use GET as defined in the route
                        credentials: 'include', // Still needed to identify the current user (admin)
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to fetch users.');
                    }
                    const data = await response.json();
                    setUsers(data);
                } catch (err) {
                    setFetchError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUsers();
        }
    }, [isOpen, projectId]);

    // Keyboard navigation and closing handlers
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const filteredUsers = searchTerm
        ? users.filter(user =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : []; // Only show users if there is a search term

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchTerm(user.fullName);
        setIsDropdownOpen(false);
        setSubmitError(null); // Clear any previous errors
    };

    const handleSubmit = async () => {
        if (!selectedUser) {
            setSubmitError('Please select a user to add.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const endpoint = roleToAdd === 'admin' ? 'admins' : 'members';
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects/${projectId}/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: selectedUser.email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to add ${roleToAdd}.`);
            }

            if (onUserAdded) {
                onUserAdded();
            }
            onClose();

        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-8">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 rounded-full p-1 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                                <UserPlus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">
                                    {title}
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-900">
                                Search for a user
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    // UPDATED: Logic moved here. Dropdown opens only if there's text.
                                    onChange={(e) => {
                                        const newSearchTerm = e.target.value;
                                        setSearchTerm(newSearchTerm);
                                        setSelectedUser(null);
                                        setIsDropdownOpen(!!newSearchTerm); // Open if term exists, close if empty
                                    }}
                                    // REMOVED: onFocus handler is gone
                                    placeholder="Search by name or email..."
                                    autoComplete="off"
                                    className="block w-full rounded-xl border-gray-300 pl-12 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm transition-all placeholder:text-gray-400"
                                />

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 border border-gray-200">
                                        <div className="max-h-64 overflow-auto">
                                            {isLoading ? (
                                                <div className="px-4 py-8 text-center">
                                                    <div className="inline-flex items-center space-x-2 text-gray-500">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                                                        <span className="text-sm">Loading users...</span>
                                                    </div>
                                                </div>
                                            ) : fetchError ? (
                                                <div className="px-4 py-8 text-center">
                                                    <div className="flex items-center justify-center space-x-2 text-red-600">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="text-sm">{fetchError}</span>
                                                    </div>
                                                </div>
                                            ) : filteredUsers.length > 0 ? (
                                                <div className="py-1">
                                                    {filteredUsers.map((user, index) => (
                                                        <button
                                                            key={user.id}
                                                            onClick={() => handleSelectUser(user)}
                                                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <img
                                                                        src={user.profilePhoto}
                                                                        alt=""
                                                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-gray-900 truncate">
                                                                            {user.fullName}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 truncate">
                                                                            {user.email}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {selectedUser?.id === user.id && (
                                                                    <Check className="h-4 w-4 text-blue-600" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-8 text-center">
                                                    <div className="text-gray-500">
                                                        <Search className="h-6 w-6 mx-auto mb-2 opacity-40" />
                                                        <p className="text-sm">No users found</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Try adjusting your search terms
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected User Display */}
                        {selectedUser && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={selectedUser.profilePhoto}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{selectedUser.fullName}</div>
                                        <div className="text-sm text-gray-600">{selectedUser.email}</div>
                                    </div>
                                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Selected
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-red-900">Error</div>
                                        <div className="text-sm mt-1">{submitError}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!selectedUser || isSubmitting}
                                className="inline-flex justify-center items-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        {buttonText}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AddUserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    roleToAdd: PropTypes.oneOf(['admin', 'member']),
    projectId: PropTypes.string.isRequired,
    onUserAdded: PropTypes.func.isRequired,
};

export default AddUserModal;