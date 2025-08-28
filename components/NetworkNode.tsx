
import React, { useState } from 'react';
import type { User } from '../types';

interface NetworkNodeProps {
  node: User;
  level: number;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first few levels

  const toggleOpen = () => setIsOpen(!isOpen);

  const hasChildren = node.referrals && node.referrals.length > 0;
  
  const cardBg = level === 0 ? 'bg-indigo-100 border-indigo-500' : 'bg-white';
  const levelMargin = { marginLeft: `${level * 20}px` };

  return (
    <div style={levelMargin} className="my-2">
      <div className={`flex items-center p-3 rounded-lg shadow-sm border-l-4 ${cardBg}`}>
        {hasChildren && (
          <button onClick={toggleOpen} className="mr-2 p-1 focus:outline-none rounded-full hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <div className={`flex-grow ${!hasChildren ? 'ml-8' : ''}`}>
          <p className="font-semibold text-gray-800">{node.name} <span className="text-sm font-normal text-gray-500">({node.username})</span></p>
          <p className="text-sm text-gray-600">Points: <span className="font-bold text-primary">{node.points.toLocaleString()}</span></p>
          <p className="text-xs text-gray-500">Direct Referrals: {node.referrals.length}</p>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="mt-2">
          {node.referrals.map((child: any) => (
            <NetworkNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkNode;
