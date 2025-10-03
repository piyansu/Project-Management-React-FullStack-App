import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    ChevronsLeft,
    Home,
    FolderKanban,
    Settings,
    User,
    LogOut,
    ChevronDown,
    ChevronRight,
    Bell,
    X,
    Folder,
    Plus,
    ClipboardList
} from 'lucide-react';

import projectManLogo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
    const [tasksDropdownOpen, setTasksDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const {user,  logout } = useAuth();
    const navigate = useNavigate();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    const location = useLocation();

    const profileRef = useRef(null);
    const dropdownRef = useRef(null);

    const sidebarItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: FolderKanban, label: 'Projects', href: '/projects', hasDropdown: true },
        { icon: ClipboardList, label: 'Tasks', href: '/tasks', hasDropdown: true },
        {label: 'Coworkers', icon: Plus, href: '/coworkers' },
    ];

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/projects`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error)
        {
            console.error('Error fetching projects:', error);
        }
    };

    const toggleSidebar = () => {
        if (isDesktop) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setMobileSidebarOpen(!mobileSidebarOpen);
        }
    };

    const toggleProjectsDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectsDropdownOpen(!projectsDropdownOpen);
    };

    const toggleTasksDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTasksDropdownOpen(!tasksDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

    useEffect(() => {
        fetchProjects();
    }, []);

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
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-4 pl-7 border-b border-gray-100">
                    {(isDesktop ? sidebarOpen : mobileSidebarOpen) ? (
                        <div className="flex items-center space-x-3">
                            <img
                                src={projectManLogo}
                                className="w-45 h-10"
                                alt="ProjectMan Logo"
                            />
                        </div>
                    ) : (
                        isDesktop && <div className="w-8 h-8"></div>
                    )}
                    
                    {!isDesktop && mobileSidebarOpen && (
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="ml-auto p-1 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item, index) => {
                        const IconComponent = item.icon;
                        
                        // **MODIFICATION START**: Improved active state logic
                        const isProjectsPath = item.href === '/projects' && location.pathname.startsWith('/projects');
                        const isTasksPath = item.href === '/tasks' && location.pathname.startsWith('/tasks');
                        const isActive = location.pathname === item.href || isProjectsPath || isTasksPath;
                        // **MODIFICATION END**
                        
                        return (
                            <div key={index} className="relative">
                                <div className="flex items-center group">
                                    <Link
                                        to={item.href}
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 flex-1 relative overflow-hidden ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200/50'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                        onClick={() => !isDesktop && setMobileSidebarOpen(false)}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                                        )}
                                        
                                        <IconComponent className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                                            isActive ? 'text-blue-600 scale-110' : 'group-hover:text-blue-600 group-hover:scale-105'
                                        }`} />
                                        
                                        {(isDesktop ? sidebarOpen : mobileSidebarOpen) && (
                                            <span className={`font-medium text-sm transition-all duration-200 ${
                                                isActive ? 'text-blue-700' : 'text-gray-700'
                                            }`}>{item.label}</span>
                                        )}
                                        
                                        {isDesktop && !sidebarOpen && (
                                            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 whitespace-nowrap shadow-xl">
                                                {item.label}
                                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900"></div>
                                            </div>
                                        )}
                                    </Link>
                                    
                                    {item.hasDropdown && (isDesktop ? sidebarOpen : mobileSidebarOpen) && (
                                        <>
                                            {item.href === '/projects' && projects.length > 0 && (
                                                <button
                                                    onClick={toggleProjectsDropdown}
                                                    className={`p-2 rounded-lg transition-all duration-200 mr-1 cursor-pointer ${
                                                        projectsDropdownOpen 
                                                            ? 'bg-blue-100 text-blue-600' 
                                                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                                    }`}
                                                >
                                                    <ChevronRight className={`w-4 h-4 transform transition-all duration-300  ${
                                                        projectsDropdownOpen ? 'rotate-90 scale-110' : ''
                                                    }`} />
                                                </button>
                                            )}
                                            {item.href === '/tasks' && projects.length > 0 && (
                                                <button
                                                    onClick={toggleTasksDropdown}
                                                    className={`p-2 rounded-lg transition-all duration-200 mr-1 cursor-pointer ${
                                                        tasksDropdownOpen 
                                                            ? 'bg-blue-100 text-blue-600' 
                                                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                                    }`}
                                                >
                                                    <ChevronRight className={`w-4 h-4 transform transition-all duration-300  ${
                                                        tasksDropdownOpen ? 'rotate-90 scale-110' : ''
                                                    }`} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                {item.hasDropdown && (isDesktop ? sidebarOpen : mobileSidebarOpen) && (
                                    <>
                                        {item.href === '/projects' && projects.length > 0 && (
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                projectsDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                                <div className="ml-6 mt-2 space-y-1 pl-4 border-l-2 border-gray-100">
                                                    {projects.map((project) => {
                                                        const projectPath = `/projects/${project._id}`;
                                                        const isProjectActive = location.pathname.startsWith(projectPath);
                                                        
                                                        return (
                                                            <Link
                                                                key={project._id}
                                                                to={projectPath}
                                                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                                                                    isProjectActive
                                                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50 shadow-sm'
                                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                                onClick={() => !isDesktop && setMobileSidebarOpen(false)}
                                                            >
                                                                {isProjectActive && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-full"></div>
                                                                )}
                                                                <Folder className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                                                                    isProjectActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                                                                }`} />
                                                                <span className={`font-medium truncate ${
                                                                    isProjectActive ? 'text-blue-700' : 'text-gray-700'
                                                                }`}>
                                                                    {project.title}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* **MODIFICATION START**: Tasks dropdown links updated */}
                                        {item.href === '/tasks' && projects.length > 0 && (
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                tasksDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                                <div className="ml-6 mt-2 space-y-1 pl-4 border-l-2 border-gray-100">
                                                    {projects.map((project) => {
                                                        const taskPath = `/tasks/${project._id}`;
                                                        const isTaskPathActive = location.pathname.startsWith(taskPath);
                                                        
                                                        return (
                                                            <Link
                                                                key={project._id}
                                                                to={taskPath}
                                                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                                                                    isTaskPathActive
                                                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50 shadow-sm'
                                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                                onClick={() => !isDesktop && setMobileSidebarOpen(false)}
                                                            >
                                                                {isTaskPathActive && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-full"></div>
                                                                )}
                                                                <ClipboardList className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                                                                    isTaskPathActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                                                                }`} />
                                                                <span className={`font-medium truncate ${
                                                                    isTaskPathActive ? 'text-blue-700' : 'text-gray-700'
                                                                }`}>
                                                                    {project.title}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/* **MODIFICATION END** */}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 group"
                        >
                            {(isDesktop ? sidebarOpen : mobileSidebarOpen) ? (
                                <ChevronsLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200 cursor-pointer" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200 cursor-pointer" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 cursor-pointer group">
                            <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs text-white font-bold">3</span>
                            </div>
                        </button>

                        <div className="relative" ref={profileRef}>
                            <button className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 cursor-pointer group">
                                <div className="relative">
                                    {user.profilePhoto ? (
                                        <img 
                                            src={user.profilePhoto} 
                                            alt="Profile" 
                                            className="w-8 h-8 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                            <span className="text-white text-sm font-bold">{user.fullName.slice(0, 1).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                                    profileDropdownOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'
                                }`} />
                            </button>

                            {profileDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                {user.profilePhoto ? (
                                                    <img 
                                                        src={user.profilePhoto} 
                                                        alt="Profile" 
                                                        className="w-10 h-10 rounded-full object-cover shadow-md"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <button onClick={() => navigate('/profile')} className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50/80 transition-all duration-200 group cursor-pointer">
                                            <User className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                            <span className="text-sm font-medium">My Profile</span>
                                        </button>

                                        <a href="/settings" className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50/80 transition-all duration-200 group">
                                            <Settings className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                            <span className="text-sm font-medium">Settings</span>
                                        </a>

                                        <hr className="my-1 border-gray-100" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50/80 transition-all duration-200 cursor-pointer group"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                            <span className="text-sm font-medium">Sign Out</span>
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

            {!isDesktop && mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;