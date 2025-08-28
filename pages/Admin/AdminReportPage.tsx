
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import NetworkNode from '../../components/NetworkNode';

const AdminReportPage: React.FC = () => {
    const { currentUser, getNetworkTree } = useAppContext();

    const networkTree = useMemo(() => {
        if (!currentUser || currentUser.role !== 'admin') return null;
        return getNetworkTree(currentUser.id);
    }, [currentUser, getNetworkTree]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-neutral mb-4">Full Network Report</h1>
            <p className="text-gray-600 mb-6">This report shows the entire network structure starting from the admin account.</p>
            {networkTree ? (
                <NetworkNode node={networkTree} level={0} />
            ) : (
                <p>No network data to display. Please ensure the admin account is set up correctly.</p>
            )}
        </div>
    );
};

export default AdminReportPage;
