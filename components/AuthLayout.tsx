import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Logo className="h-24 w-24 mx-auto" />
            <p className="text-gray-500 mt-4">Your Gateway to Growth</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
