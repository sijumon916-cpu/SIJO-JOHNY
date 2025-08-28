
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  role: 'admin' | 'member';
  referrerId: string | null;
  referrals: string[];
  points: number;
  task1Completed: boolean;
  task2Completed: boolean;
  createdAt: string;
}

export interface ReferralCode {
  code: string;
  ownerId: string; // Renamed from generatedBy
  isUsed: boolean;
  usedBy?: string; // ID of the user who used it
  createdAt: string;
}

export interface ReferralCodeRequest {
  id: string;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface LoginLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  name: string;
}

export type TaskStatus = 'locked' | 'in_progress' | 'completed';

export interface Task {
    id: number;
    title: string;
    description: string;
    reward: number;
    status: TaskStatus;
    progress: number;
    progressTotal: number;
}