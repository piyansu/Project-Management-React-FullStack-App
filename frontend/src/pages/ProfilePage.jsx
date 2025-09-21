import { User, Mail, Calendar, Edit3, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ProfilePage = () => {
    const { user , checkUserSession} = useAuth();
    
    // State for editing functionality
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedBio, setEditedBio] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);
    const [isSavingBio, setIsSavingBio] = useState(false);

    // --- State for profile photo editing ---
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // --- Handlers for photo upload ---
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhotoFile(file);
            setProfilePhotoPreview(URL.createObjectURL(file));
            setIsEditingPhoto(true); // Show save/cancel buttons
        }
    };

    const handleCancelEditPhoto = () => {
        setIsEditingPhoto(false);
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
    };

    const handleSavePhoto = async () => {
        if (!profilePhotoFile) return;
        
        setIsSavingPhoto(true);
        const formData = new FormData();
        formData.append('profilePhoto', profilePhotoFile); // This key must match your backend

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/profile`, {
                method: 'PUT',
                credentials: 'include',
                body: formData, // Send FormData, browser will set Content-Type header
            });

            if (response.ok) {
                window.location.reload();
                // Reset state after successful upload
                setIsEditingPhoto(false);
                setProfilePhotoFile(null);
                setProfilePhotoPreview(null);
            } else {
                console.error('Failed to update profile photo');
                // Handle error (e.g., show a toast notification)
            }
        } catch (error) {
            console.error('Error updating profile photo:', error);
        } finally {
            setIsSavingPhoto(false);
        }
    };

    const handleEditName = () => {
        setEditedName(user.fullName || '');
        setIsEditingName(true);
    };

    const handleEditBio = () => {
        setEditedBio(user.bio || '');
        setIsEditingBio(true);
    };

    const handleCancelEditName = () => {
        setIsEditingName(false);
        setEditedName('');
    };



    const handleCancelEditBio = () => {
        setIsEditingBio(false);
        setEditedBio('');
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) return;
        
        setIsSavingName(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullName: editedName.trim()
                })
            });

            if (response.ok) {
                window.location.reload();
                setIsEditingName(false);
                setEditedName('');
            } else {
                console.error('Failed to update name');
            }
        } catch (error) {
            console.error('Error updating name:', error);
        } finally {
            setIsSavingName(false);
        }
    };

    const handleSaveBio = async () => {
        setIsSavingBio(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    bio: editedBio.trim()
                })
            });

            if (response.ok) {
                window.location.reload();
                setIsEditingBio(false);
                setEditedBio('');
            } else {
                console.error('Failed to update bio');
            }
        } catch (error) {
            console.error('Error updating bio:', error);
        } finally {
            setIsSavingBio(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading user data...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        {/* Profile Header */}
                        <div className="px-8 py-8 border-b border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center space-x-6">
                                    {/* Profile Photo Section */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                {user.profilePhoto || profilePhotoPreview ? (
                                                    <img
                                                        src={profilePhotoPreview || user.profilePhoto}
                                                        alt={user.fullName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    user.fullName?.charAt(0).toUpperCase() || 'U'
                                                )}
                                            </div>
                                            {/* Hidden file input */}
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                className="hidden"
                                                onChange={handlePhotoChange}
                                                accept="image/png, image/jpeg"
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                                            >
                                                <Camera className="w-4 h-4 text-slate-600" />
                                            </label>
                                        </div>

                                        {/* Save/Cancel buttons for photo */}
                                        {isEditingPhoto && (
                                            <div className="flex items-center space-x-2 mt-3">
                                                <button
                                                    onClick={handleSavePhoto}
                                                    disabled={isSavingPhoto}
                                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                    title="Save photo"
                                                >
                                                    {isSavingPhoto ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleCancelEditPhoto}
                                                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name and Edit */}
                                    <div className="flex-1">
                                        {isEditingName ? (
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="text"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your full name"
                                                    autoFocus
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={handleSaveName}
                                                        disabled={isSavingName || !editedName.trim()}
                                                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                        title="Save changes"
                                                    >
                                                        {isSavingName ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditName}
                                                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                                        title="Cancel editing"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                                    {user.fullName || 'User Name'}
                                                </h1>
                                                <button
                                                    onClick={handleEditName}
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit name"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - About & Contact */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Bio Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                                About
                                            </h3>
                                            {!isEditingBio && (
                                                <button
                                                    onClick={handleEditBio}
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit bio"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        {isEditingBio ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editedBio}
                                                    onChange={(e) => setEditedBio(e.target.value)}
                                                    className="w-full text-slate-700 leading-relaxed bg-white border border-slate-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
                                                    placeholder="Tell us about yourself..."
                                                    autoFocus
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={handleSaveBio}
                                                        disabled={isSavingBio}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        {isSavingBio ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                        <span>Save</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditBio}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                                                {user.bio || 'No bio available yet.'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                                            <Mail className="w-5 h-5 mr-2 text-blue-600" />
                                            Contact Information
                                        </h3>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <div className="flex items-center text-slate-700">
                                                <Mail className="w-4 h-4 mr-3 text-slate-500" />
                                                <span className="font-medium mr-2">Email:</span>
                                                <a className="text-blue-600 hover:text-blue-800 transition-colors">
                                                    {user.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Stats & Info */}
                                <div className="space-y-6">
                                    {/* Account Info */}
                                    <div className="bg-slate-50 p-6 rounded-xl">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                                                <span className="text-slate-600">Member since:</span>
                                                <span className="ml-2 font-medium text-slate-900">
                                                    {formatDate(user.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Edit3 className="w-4 h-4 mr-2 text-slate-500" />
                                                <span className="text-slate-600">Last updated:</span>
                                                <span className="ml-2 font-medium text-slate-900">
                                                    {formatDate(user.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;