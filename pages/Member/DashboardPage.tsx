
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import TaskCard from '../../components/TaskCard';
import WithdrawModal from '../../components/WithdrawModal';
import type { Task, TaskStatus, User } from '../../types';

const DashboardPage: React.FC = () => {
    const { currentUser, users, referralCodes, referralCodeRequests, requestReferralCode } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    const AED_PER_1000_POINTS = 50;
    const MIN_WITHDRAWAL_AED = 500;
    const MIN_WITHDRAWAL_POINTS = (MIN_WITHDRAWAL_AED / AED_PER_1000_POINTS) * 1000;

    const aedBalance = currentUser ? (currentUser.points / 1000) * AED_PER_1000_POINTS : 0;
    const canWithdraw = aedBalance >= MIN_WITHDRAWAL_AED;
    
    const handleRequestCode = async () => {
        setIsRequesting(true);
        await requestReferralCode();
        setIsRequesting(false);
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const memberCodes = useMemo(() => {
        if (!currentUser) return [];
        return referralCodes.filter(c => c.ownerId === currentUser.id && !c.isUsed)
    }, [referralCodes, currentUser]);

    const pendingRequest = useMemo(() => {
        if (!currentUser) return null;
        return referralCodeRequests.find(r => r.requesterId === currentUser.id && r.status === 'pending');
    }, [referralCodeRequests, currentUser]);

    const hasBeenApprovedBefore = useMemo(() => {
        if (!currentUser) return false;
        return referralCodeRequests.some(r => r.requesterId === currentUser.id && r.status === 'approved');
    }, [referralCodeRequests, currentUser]);

    const canRequestCode = !pendingRequest && !hasBeenApprovedBefore;

    const tasks = useMemo<Task[]>(() => {
        if (!currentUser) return [];

        const task1Status: TaskStatus = currentUser.task1Completed ? 'completed' : 'in_progress';
        const task1: Task = {
            id: 1,
            title: 'Task 1: Build Your Team',
            description: 'Recruit three new members under your referral.',
            reward: 1000,
            status: task1Status,
            progress: currentUser.referrals.length,
            progressTotal: 3,
        };

        let task2Status: TaskStatus = 'locked';
        let task2Progress = 0;
        if(currentUser.task1Completed) {
            task2Status = currentUser.task2Completed ? 'completed' : 'in_progress';
            const directReferrals = users.filter(u => currentUser.referrals.includes(u.id));
            task2Progress = directReferrals.reduce((sum, ref) => sum + ref.referrals.length, 0);
        }

        const task2: Task = {
            id: 2,
            title: 'Task 2: Expand the Network',
            description: 'Help your three referred members to each bring in three new people.',
            reward: 2000,
            status: task2Status,
            progress: task2Progress,
            progressTotal: 9,
        };

        return [task1, task2];
    }, [currentUser, users]);

    if (!currentUser) {
        return <p>Loading...</p>;
    }
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-bold text-neutral">Welcome, {currentUser.name}!</h2>
                    <p className="text-gray-600">Here's your performance overview.</p>
                </div>
                <div className="bg-gradient-to-r from-primary to-indigo-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold">Your Points</h3>
                    <p className="text-4xl font-bold">{currentUser.points.toLocaleString()}</p>
                    <p className="text-md opacity-90">≈ {aedBalance.toFixed(2)} AED</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold text-neutral">Your Referral Codes</h2>
                    {canRequestCode && (
                        <button 
                            onClick={handleRequestCode}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isRequesting}
                        >
                            {isRequesting ? 'Requesting...' : 'Request New Code'}
                        </button>
                    )}
                </div>

                {pendingRequest && (
                    <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white p-4 rounded-lg shadow-lg mb-4 text-center" role="alert">
                        <p className="font-bold text-lg">Request Pending Approval</p>
                        <p className="mt-1">You will receive <span className="font-extrabold">500 points</span> and your new code once an admin approves it.</p>
                    </div>
                )}

                {memberCodes.length > 0 ? (
                    <div className="space-y-2">
                        {memberCodes.map(code => (
                            <div key={code.code} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <span className="font-mono text-primary font-semibold text-lg">{code.code}</span>
                                <button 
                                    onClick={() => handleCopy(code.code)}
                                    className="bg-gray-200 text-gray-700 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-300 transition w-20"
                                >
                                    {copiedCode === code.code ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !pendingRequest && (
                        <>
                            {canRequestCode && <p className="text-gray-600 text-center py-4">You have no active referral codes. Request one to start building your network!</p>}
                            {hasBeenApprovedBefore && <p className="text-gray-600 text-center py-4">You have used your one-time code request and have no available codes.</p>}
                        </>
                    )
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-neutral">Withdrawal</h2>
                    <div className="text-right">
                        {!canWithdraw && (
                            <p className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                                Minimum {MIN_WITHDRAWAL_AED} AED required to withdraw.
                            </p>
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={!canWithdraw}
                            className="mt-2 w-full sm:w-auto bg-secondary text-white font-bold py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Withdraw Funds
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-neutral mb-4">Your Tasks</h2>
                <div className="space-y-4">
                    {tasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            </div>
            
            <WithdrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={currentUser} />
        </div>
    );
};

export default DashboardPage;
