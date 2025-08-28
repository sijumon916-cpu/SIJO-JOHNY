
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Logo from './Logo';

const NotificationBar: React.FC = () => (
    <div className="bg-primary text-white text-center p-2 text-sm font-medium">
        1,000 points = 50 AED
    </div>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = currentUser?.role === 'admin'
        ? [
            { path: '/admin/dashboard', label: 'Dashboard' },
            { path: '/admin/report', label: 'Network Report' },
        ]
        : [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/network', label: 'My Network' },
            { path: '/terms', label: 'Terms' },
        ];

    return (
        <div className="min-h-screen bg-base-100">
            <NotificationBar />
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <Logo className="h-10 w-10" />
                            <span className="ml-2 text-xl font-bold text-neutral">JualS</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-4">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-4">Welcome, {currentUser?.name}</span>
                            {currentUser && (
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-error text-white text-xs font-bold py-1 px-3 rounded-lg shadow-sm hover:bg-red-600 transition"
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;