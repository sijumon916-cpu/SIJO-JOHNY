
import React from 'react';
import type { User } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral">Withdrawal Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-700">Your request has been received.</p>
            <p className="text-gray-600 mt-2">We will contact you shortly for verification and processing.</p>
            <div className="mt-6 bg-gray-100 p-4 rounded-md text-left">
                <p className="text-sm text-gray-800"><span className="font-semibold">Name:</span> {user.name}</p>
                <p className="text-sm text-gray-800"><span className="font-semibold">Contact Number:</span> {user.mobile}</p>
            </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WithdrawModal;
