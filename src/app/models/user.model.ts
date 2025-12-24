export interface User {
    id: number;
    name: string;
    email: string;
    role: 'farmer' | 'buyer';
    avatar?: string;
    phone?: string;
    address?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}
