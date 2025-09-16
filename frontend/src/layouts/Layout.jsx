import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
    Menu,
    ChevronsLeft,
    Home,
    FolderKanban,
    Users,
    Calendar,
    BarChart3,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Bell,
    X
} from 'lucide-react';

import projectManLogo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const {user,  logout } = useAuth();
    const navigate = useNavigate();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    const profileRef = useRef(null);
    const dropdownRef = useRef(null);

    const sidebarItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
        { icon: FolderKanban, label: 'Projects', href: '/projects', active: false },
        { icon: Users, label: 'Team', href: '/team', active: false },
        { icon: Calendar, label: 'Calendar', href: '/calendar', active: false },
        { icon: BarChart3, label: 'Analytics', href: '/analytics', active: false },
        { icon: Settings, label: 'Settings', href: '/settings', active: false },
    ];

    const toggleSidebar = () => {
        if (isDesktop) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setMobileSidebarOpen(!mobileSidebarOpen);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 1024;
            setIsDesktop(isLargeScreen);
            if (isLargeScreen) {
                setMobileSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle hover for profile dropdown
    useEffect(() => {
        const profileElement = profileRef.current;
        const dropdownElement = dropdownRef.current;

        if (!profileElement) return;

        let hoverTimeout;

        const handleMouseEnter = () => {
            clearTimeout(hoverTimeout);
            setProfileDropdownOpen(true);
        };

        const handleMouseLeave = () => {
            hoverTimeout = setTimeout(() => {
                setProfileDropdownOpen(false);
            }, 150);
        };

        profileElement.addEventListener('mouseenter', handleMouseEnter);
        profileElement.addEventListener('mouseleave', handleMouseLeave);

        if (dropdownElement) {
            dropdownElement.addEventListener('mouseenter', handleMouseEnter);
            dropdownElement.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            profileElement.removeEventListener('mouseenter', handleMouseEnter);
            profileElement.removeEventListener('mouseleave', handleMouseLeave);
            if (dropdownElement) {
                dropdownElement.removeEventListener('mouseenter', handleMouseEnter);
                dropdownElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            clearTimeout(hoverTimeout);
        };
    }, [profileDropdownOpen]);

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 flex overflow-hidden">
            {/* Responsive Sidebar */}
            <div
                className={`
                    ${isDesktop 
                        ? (sidebarOpen ? 'w-64' : 'w-16') 
                        : 'w-64 fixed'
                    }
                    ${!isDesktop && (mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full')}
                    z-50 inset-y-0 left-0 bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200
                `}
            >
                {/* Compact Sidebar Header */}
                <div className="h-16 flex items-center px-4 pl-7 border-b border-gray-100">
                    {(isDesktop ? sidebarOpen : mobileSidebarOpen) ? (
                        <div className="flex items-center space-x-3">
                            <img
                                src={projectManLogo}
                                className="w-45 h-10"
                            />
                        </div>
                    ) : (
                        isDesktop && <div className="w-8 h-8"></div>
                    )}
                    
                    {/* Mobile close button */}
                    {!isDesktop && mobileSidebarOpen && (
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="ml-auto p-1 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Compact Sidebar Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={index}
                                to={item.href}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                                    item.active
                                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={() => !isDesktop && setMobileSidebarOpen(false)}
                            >
                                <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                                    item.active ? 'text-blue-600' : 'group-hover:text-blue-600'
                                } transition-colors duration-200`} />
                                {(isDesktop ? sidebarOpen : mobileSidebarOpen) && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                                
                                {/* Tooltip for collapsed desktop sidebar */}
                                {isDesktop && !sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                                        {item.label}
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-2 border-b-2 border-r-2 border-t-transparent border-b-transparent border-r-gray-900"></div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Compact Navbar */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-6">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleSidebar}
                        >
                            {(isDesktop ? sidebarOpen : mobileSidebarOpen) ? (
                                <ChevronsLeft className="w-8 h-8 text-gray-600 ml-[-15px] rounded-lg hover:bg-gray-100 transition-all duration-400 p-1 cursor-pointer" />
                            ) : (
                                <Menu className="w-8 h-8 text-gray-600 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-400 p-2" />
                            )}
                        </button>

                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                            <Bell className="w-5 h-5 text-gray-600 " />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">3</span>
                            </div>
                        </button>

                        {/* Compact Profile dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl font-bold mt-[-2px]">{user.fullName.slice(0, 1).toUpperCase()}</span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                    profileDropdownOpen ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {/* Compact Profile Dropdown */}
                            {profileDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Menu Items */}
                                    <div className="py-1">
                                        <a href="/profile" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">My Profile</span>
                                        </a>

                                        <a href="/settings" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <Settings className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">Settings</span>
                                        </a>

                                        <hr className="my-1 border-gray-100" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {!isDesktop && mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 backdrop-blur-sm"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;