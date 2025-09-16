import React from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LoadingScreen = () => {
    return (
        <div className="space-y-6 pb-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-6 bg-gray-200 rounded w-96 mb-2"></div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="flex items-center mt-4">
                            <div className="h-4 bg-gray-200 rounded w-12 mr-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Tasks Skeleton */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="flex items-center space-x-2">
                                <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
                                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="border border-gray-100 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-5 bg-gray-200 rounded w-48"></div>
                                                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                            </div>
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Skeleton */}
                <div className="space-y-6">
                    {/* Upcoming Deadlines Skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
                                        <div className="w-2 h-2 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                                            <div className="h-4 bg-gray-200 rounded-full w-8"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RouteProtect = ({ children }) => {
    const { isLoggedin, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isLoggedin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};