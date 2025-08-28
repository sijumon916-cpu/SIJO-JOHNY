import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, ReferralCode, ReferralCodeRequest, LoginLog } from '../types';
import * as api from '../services/api';
import type { LoginCredentials, RegisterData } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  referralCodes: ReferralCode[];
  referralCodeRequests: ReferralCodeRequest[];
  loginLogs: LoginLog[];
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
  register: (data: RegisterData) => Promise<User | null>;
  createReferralCode: () => Promise<ReferralCode | null>;
  requestReferralCode: () => Promise<ReferralCodeRequest | null>;
  approveReferralCodeRequest: (requestId: string) => Promise<void>;
  cancelMemberAccount: (memberId: string) => Promise<void>;
  getNetworkTree: (userId: string) => User | null;
  fetchData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referralCodeRequests, setReferralCodeRequests] = useState<ReferralCodeRequest[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const allUsers = api.getAllUsers();
    const allCodes = api.getAllReferralCodes();
    const allRequests = api.getAllReferralCodeRequests();
    const allLogs = api.getAllLoginLogs();
    setUsers(allUsers);
    setReferralCodes(allCodes);
    setReferralCodeRequests(allRequests);
    setLoginLogs(allLogs);
    const loggedInUser = api.getCurrentUser();
    if(loggedInUser) {
        const fullUser = allUsers.find(u => u.id === loggedInUser.id);
        setCurrentUser(fullUser || null);
    } else {
        setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    api.initializeData();
    fetchData();
  }, [fetchData]);

  const login = async (credentials: LoginCredentials) => {
    const user = await api.login(credentials);
    if (user) {
      fetchData(); // fetch all data to get updated user object and logs
    }
    return user;
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const register = async (data: RegisterData) => {
    const newUser = await api.register(data);
    if (newUser) {
      fetchData(); // Refresh all data after registration
    }
    return newUser;
  };

  const createReferralCode = async () => {
    if (currentUser) {
      const newCode = api.generateReferralCode(currentUser.id);
      fetchData(); // Refresh data
      return newCode;
    }
    return null;
  };

  const requestReferralCode = async () => {
    if (currentUser) {
      const newRequest = await api.createReferralCodeRequest(currentUser.id);
      fetchData(); // Refresh data
      return newRequest;
    }
    return null;
  }

  const approveReferralCodeRequest = async (requestId: string) => {
    await api.approveReferralCodeRequest(requestId);
    fetchData(); // Refresh data
  }

  const cancelMemberAccount = async (memberId: string) => {
    await api.cancelMemberAccount(memberId);
    fetchData(); // Refresh data
  }
  
  const getNetworkTree = (userId: string): User | null => {
    const allUsers = api.getAllUsers(); // Use fresh data for accuracy
    const userMap = new Map(allUsers.map(u => [u.id, { ...u, referrals: [] as any[] }]));

    allUsers.forEach(user => {
        if (user.referrerId && userMap.has(user.referrerId)) {
            const parent = userMap.get(user.referrerId);
            const child = userMap.get(user.id);
            if(parent && child) {
                parent.referrals.push(child);
            }
        }
    });

    return userMap.get(userId) || null;
  };


  return (
    <AppContext.Provider value={{ currentUser, users, referralCodes, referralCodeRequests, loginLogs, loading, login, logout, register, createReferralCode, requestReferralCode, approveReferralCodeRequest, cancelMemberAccount, getNetworkTree, fetchData }}>
      {!loading && children}
    </AppContext.Provider>
  );
};