import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, AuthState } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState: AuthState = {
        isAuthenticated: false,
        user: null
    };

    private authSubject = new BehaviorSubject<AuthState>(this.authState);
    auth$ = this.authSubject.asObservable();

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const stored = localStorage.getItem('digitalFarmerAuth');
        if (stored) {
            this.authState = JSON.parse(stored);
            this.authSubject.next(this.authState);
        }
    }

    private saveToStorage(): void {
        localStorage.setItem('digitalFarmerAuth', JSON.stringify(this.authState));
        this.authSubject.next(this.authState);
    }

    login(email: string, password: string): boolean {
        // Mock login - in real app, this would call an API
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email);

        if (user) {
            this.authState = {
                isAuthenticated: true,
                user: user
            };
            this.saveToStorage();
            return true;
        }
        return false;
    }

    register(name: string, email: string, password: string, role: 'farmer' | 'buyer'): boolean {
        const users = this.getStoredUsers();

        if (users.find(u => u.email === email)) {
            return false; // User already exists
        }

        const newUser: User = {
            id: Date.now(),
            name,
            email,
            role
        };

        users.push(newUser);
        localStorage.setItem('digitalFarmerUsers', JSON.stringify(users));

        this.authState = {
            isAuthenticated: true,
            user: newUser
        };
        this.saveToStorage();
        return true;
    }

    logout(): void {
        this.authState = {
            isAuthenticated: false,
            user: null
        };
        localStorage.removeItem('digitalFarmerAuth');
        this.authSubject.next(this.authState);
    }

    getCurrentUser(): User | null {
        return this.authState.user;
    }

    isAuthenticated(): boolean {
        return this.authState.isAuthenticated;
    }

    isFarmer(): boolean {
        return this.authState.user?.role === 'farmer';
    }

    private getStoredUsers(): User[] {
        const stored = localStorage.getItem('digitalFarmerUsers');
        return stored ? JSON.parse(stored) : [];
    }
}
