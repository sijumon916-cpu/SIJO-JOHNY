
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import NetworkNode from '../../components/NetworkNode';

const NetworkPage: React.FC = () => {
    const { currentUser, getNetworkTree } = useAppContext();

    const networkTree = useMemo(() => {
        if (!currentUser) return null;
        return getNetworkTree(currentUser.id);
    }, [currentUser, getNetworkTree]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-neutral mb-4">My Network</h1>
            <p className="text-gray-600 mb-6">This is a visualization of your direct and indirect referrals.</p>
            {networkTree ? (
                <NetworkNode node={networkTree} level={0} />
            ) : (
                <p>No network data to display.</p>
            )}
        </div>
    );
};

export default NetworkPage;
