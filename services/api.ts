import type { User, ReferralCode, ReferralCodeRequest, LoginLog } from '../types';

// In a real app, use a proper hashing library like bcrypt.
// This is a simple non-secure hash for demonstration purposes.
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

const USERS_KEY = 'mlm_users';
const CODES_KEY = 'mlm_referral_codes';
const REQUESTS_KEY = 'mlm_referral_code_requests';
const LOGIN_LOGS_KEY = 'mlm_login_logs';
const SESSION_KEY = 'mlm_session_user_id';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    mobile: string;
    username: string;
    password: string;
    referralCode: string;
}

const getUsers = (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const setUsers = (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const getReferralCodes = (): ReferralCode[] => JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
const setReferralCodes = (codes: ReferralCode[]) => localStorage.setItem(CODES_KEY, JSON.stringify(codes));
const getReferralCodeRequests = (): ReferralCodeRequest[] => JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
const setReferralCodeRequests = (requests: ReferralCodeRequest[]) => localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
const getLoginLogs = (): LoginLog[] => JSON.parse(localStorage.getItem(LOGIN_LOGS_KEY) || '[]');
const setLoginLogs = (logs: LoginLog[]) => localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(logs));


export const initializeData = () => {
    if (getUsers().length === 0) {
        const adminId = `user-${Date.now()}`;
        const admin: User = {
            id: adminId,
            username: 'JualS120683',
            passwordHash: simpleHash('Jesus1990@'),
            name: 'Admin',
            email: 'admin@network.com',
            mobile: '1234567890',
            role: 'admin',
            referrerId: null,
            referrals: [],
            points: 999999, // Admin starts with high points
            task1Completed: true,
            task2Completed: true,
            createdAt: new Date().toISOString(),
        };
        setUsers([admin]);
        setReferralCodes([]);
        setReferralCodeRequests([]);
        setLoginLogs([]);
    }
};

export const getAllUsers = (): User[] => getUsers();
export const getAllReferralCodes = (): ReferralCode[] => getReferralCodes();
export const getAllReferralCodeRequests = (): ReferralCodeRequest[] => getReferralCodeRequests();
export const getAllLoginLogs = (): LoginLog[] => getLoginLogs();


export const getCurrentUser = (): User | null => {
    const currentUserId = sessionStorage.getItem(SESSION_KEY);
    if (!currentUserId) return null;
    return getUsers().find(u => u.id === currentUserId) || null;
};

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
    const user = getUsers().find(u => u.username.toLowerCase() === credentials.username.toLowerCase());
    if (user && user.passwordHash === simpleHash(credentials.password)) {
        sessionStorage.setItem(SESSION_KEY, user.id);

        // If a member logs in, create a log entry.
        if (user.role === 'member') {
            const logs = getLoginLogs();
            const newLog: LoginLog = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: user.id,
                username: user.username,
                name: user.name,
            };
            // Add new logs to the start of the array for chronological order
            logs.unshift(newLog); 
            setLoginLogs(logs);
        }

        return user;
    }
    return null;
};

export const logout = (): void => {
    sessionStorage.removeItem(SESSION_KEY);
};

const updateUplineAndAwardPoints = (referrerId: string, allUsers: User[]): User[] => {
    let users = [...allUsers];
    const referrerIndex = users.findIndex(u => u.id === referrerId);
    if (referrerIndex === -1) return users;
    
    const referrer = { ...users[referrerIndex] };

    // Check Task 1 for referrer
    if (!referrer.task1Completed && referrer.referrals.length >= 3) {
        referrer.task1Completed = true;
        referrer.points += 1000;
    }

    // Check Task 2 for referrer
    if (referrer.task1Completed && !referrer.task2Completed) {
        const directReferrals = users.filter(u => referrer.referrals.includes(u.id));
        const grandChildCount = directReferrals.reduce((sum, ref) => sum + ref.referrals.length, 0);
        if (grandChildCount >= 9) {
            referrer.task2Completed = true;
            referrer.points += 2000;
        }
    }
    
    users[referrerIndex] = referrer;

    // Recursively check for grandparent
    if (referrer.referrerId) {
        users = updateUplineAndAwardPoints(referrer.referrerId, users);
    }

    return users;
};

export const register = async (data: RegisterData): Promise<User | null> => {
    let allUsers = getUsers();
    let allCodes = getReferralCodes();

    if (allUsers.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
        throw new Error('Username is already taken.');
    }
    if (allUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Email is already registered.');
    }

    const validCode = allCodes.find(c => c.code.toLowerCase() === data.referralCode.toLowerCase() && !c.isUsed);
    if (!validCode) {
        throw new Error('Invalid or used referral code. A valid code is required to register.');
    }
    
    const referrer = allUsers.find(u => u.id === validCode.ownerId);

    if (!referrer) {
        throw new Error('System error: A valid referrer could not be found for the provided code.');
    }

    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
        id: newUserId,
        username: data.username,
        passwordHash: simpleHash(data.password),
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: 'member',
        referrerId: referrer.id,
        referrals: [],
        points: 0,
        task1Completed: false,
        task2Completed: false,
        createdAt: new Date().toISOString(),
    };

    allUsers.push(newUser);
    
    const referrerIndex = allUsers.findIndex(u => u.id === referrer.id);
    allUsers[referrerIndex].referrals.push(newUserId);
    
    // Mark code as used
    const codeIndex = allCodes.findIndex(c => c.code === validCode.code);
    if (codeIndex !== -1) {
        allCodes[codeIndex].isUsed = true;
        allCodes[codeIndex].usedBy = newUserId;
        setReferralCodes(allCodes);
    }

    const updatedUsers = updateUplineAndAwardPoints(referrer.id, allUsers);
    setUsers(updatedUsers);
    
    return newUser;
};

export const generateReferralCode = (ownerId: string): ReferralCode => {
    const allCodes = getReferralCodes();
    const allUsers = getUsers();

    const owner = allUsers.find(u => u.id === ownerId);
    if (!owner) {
        throw new Error(`Could not find user with ID ${ownerId} to generate a code.`);
    }

    const ownerUsername = owner.username.toUpperCase();
    
    // Count existing codes for this user to determine the next sequence number.
    const ownerCodeCount = allCodes.filter(c => c.ownerId === ownerId).length;
    const nextSequence = ownerCodeCount + 1;
    
    // Format the sequence number to a 4-digit string (e.g., 1 -> "0001").
    const paddedSequence = nextSequence.toString().padStart(4, '0');
    
    const newCodeString = `${ownerUsername}${paddedSequence}`;

    const newCode: ReferralCode = {
        code: newCodeString,
        ownerId: ownerId,
        isUsed: false,
        createdAt: new Date().toISOString(),
    };

    allCodes.push(newCode);
    setReferralCodes(allCodes);
    return newCode;
};

export const createReferralCodeRequest = async (requesterId: string): Promise<ReferralCodeRequest | null> => {
    const allRequests = getReferralCodeRequests();
    const hasPendingRequest = allRequests.some(r => r.requesterId === requesterId && r.status === 'pending');
    
    if (hasPendingRequest) {
        // In a real app, you might throw an error or return a specific status
        console.warn("User already has a pending request.");
        return null;
    }

    const newRequest: ReferralCodeRequest = {
        id: `req-${Date.now()}`,
        requesterId,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    allRequests.push(newRequest);
    setReferralCodeRequests(allRequests);
    return newRequest;
}

export const approveReferralCodeRequest = async (requestId: string): Promise<void> => {
    let allRequests = getReferralCodeRequests();
    let allUsers = getUsers();
    
    const requestIndex = allRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1 || allRequests[requestIndex].status !== 'pending') {
        throw new Error("Request not found or already processed.");
    }

    const request = allRequests[requestIndex];
    const userIndex = allUsers.findIndex(u => u.id === request.requesterId);
    if (userIndex === -1) {
        throw new Error("Requester not found.");
    }
    
    // 1. Update request status
    request.status = 'approved';
    allRequests[requestIndex] = request;
    setReferralCodeRequests(allRequests);

    // 2. Generate a new code for the user
    generateReferralCode(request.requesterId);

    // 3. Award points to the user
    allUsers[userIndex].points += 500;
    setUsers(allUsers);
}

export const cancelMemberAccount = async (memberId: string): Promise<void> => {
    let allUsers = getUsers();
    let allCodes = getReferralCodes();

    const memberIndex = allUsers.findIndex(u => u.id === memberId);
    if (memberIndex === -1) {
        throw new Error("Member not found.");
    }

    const memberToDelete = allUsers[memberIndex];
    if (memberToDelete.role === 'admin') {
        throw new Error("Cannot cancel an admin account.");
    }
    
    const admin = allUsers.find(u => u.role === 'admin');
    if (!admin) {
        throw new Error("Admin account not found. Cannot re-assign referrals.");
    }

    // 1. Re-assign children of the deleted member to the admin
    const childrenIds = memberToDelete.referrals;
    const adminIndex = allUsers.findIndex(u => u.id === admin.id);

    childrenIds.forEach(childId => {
        const childIndex = allUsers.findIndex(u => u.id === childId);
        if (childIndex !== -1) {
            allUsers[childIndex].referrerId = admin.id;
            if (adminIndex !== -1 && !allUsers[adminIndex].referrals.includes(childId)) {
                allUsers[adminIndex].referrals.push(childId);
            }
        }
    });

    // 2. Remove member from their referrer's list
    if (memberToDelete.referrerId) {
        const referrerIndex = allUsers.findIndex(u => u.id === memberToDelete.referrerId);
        if (referrerIndex !== -1) {
            allUsers[referrerIndex].referrals = allUsers[referrerIndex].referrals.filter(id => id !== memberId);
        }
    }
    
    // 3. Remove the member's codes
    const updatedCodes = allCodes.filter(code => code.ownerId !== memberId);
    setReferralCodes(updatedCodes);

    // 4. Remove the member account
    const updatedUsers = allUsers.filter(user => user.id !== memberId);
    setUsers(updatedUsers);
};