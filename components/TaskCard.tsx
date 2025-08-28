
import React from 'react';
import type { Task } from '../types';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const progressPercentage = (task.progress / task.progressTotal) * 100;

    const getStatusStyles = () => {
        switch (task.status) {
            case 'completed':
                return {
                    badge: 'bg-green-100 text-green-800',
                    border: 'border-green-500',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'in_progress':
                return {
                    badge: 'bg-blue-100 text-blue-800',
                    border: 'border-blue-500',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
                        </svg>
                    )
                };
            case 'locked':
            default:
                return {
                    badge: 'bg-gray-100 text-gray-800',
                    border: 'border-gray-300',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${styles.border} ${task.status === 'locked' ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles.badge}`}>{task.status.replace('_', ' ').toUpperCase()}</span>
                    <h3 className="text-xl font-bold text-neutral mt-2">{task.title}</h3>
                </div>
                {styles.icon}
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Reward: <span className="font-bold text-secondary">{task.reward.toLocaleString()} Points</span></p>
                {task.status !== 'locked' && (
                    <div className="mt-3">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-primary">Progress</span>
                            <span className="text-sm font-medium text-primary">{task.progress} / {task.progressTotal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
