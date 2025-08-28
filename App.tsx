
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Member/DashboardPage';
import NetworkPage from './pages/Member/NetworkPage';
import TermsPage from './pages/TermsPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminReportPage from './pages/Admin/AdminReportPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAppContext } from './hooks/useAppContext';
import DashboardLayout from './components/DashboardLayout';
import AuthLayout from './components/AuthLayout';

const App: React.FC = () => {
    const { currentUser } = useAppContext();

    return (
        <Routes>
            <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Member Routes */}
            <Route path="/dashboard" element={currentUser && currentUser.role === 'member' ? <DashboardLayout><DashboardPage /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/network" element={currentUser && currentUser.role === 'member' ? <DashboardLayout><NetworkPage /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/terms" element={currentUser ? <DashboardLayout><TermsPage /></DashboardLayout> : <Navigate to="/login" />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={currentUser && currentUser.role === 'admin' ? <DashboardLayout><AdminDashboardPage /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/admin/report" element={currentUser && currentUser.role === 'admin' ? <DashboardLayout><AdminReportPage /></DashboardLayout> : <Navigate to="/login" />} />
            
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;
