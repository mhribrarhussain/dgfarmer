import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError, tap } from 'rxjs';
import { User, AuthState } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private currentUser = signal<User | null>(null);
    private token = signal<string | null>(null);

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const storedToken = localStorage.getItem('dgfarmer_token');
        const storedUser = localStorage.getItem('dgfarmer_user');

        if (storedToken && storedUser) {
            this.token.set(storedToken);
            this.currentUser.set(JSON.parse(storedUser));
        }
    }

    login(email: string, password: string): Observable<{ success: boolean; error?: string }> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
            tap(response => {
                this.saveAuth(response);
            }),
            map(() => ({ success: true })),
            catchError(error => {
                const message = error.error?.message || 'Login failed. Please try again.';
                return of({ success: false, error: message });
            })
        );
    }

    register(name: string, email: string, password: string, role: string): Observable<{ success: boolean; error?: string }> {
        return this.http.post<any>(`${this.apiUrl}/auth/register`, {
            name,
            email,
            password,
            role
        }).pipe(
            tap(response => {
                this.saveAuth(response);
            }),
            map(() => ({ success: true })),
            catchError(error => {
                const message = error.error?.message || 'Registration failed. Please try again.';
                return of({ success: false, error: message });
            })
        );
    }

    private saveAuth(response: any) {
        const user: User = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role as 'farmer' | 'buyer',
            phone: response.phone,
            address: response.address
        };

        this.currentUser.set(user);
        this.token.set(response.token);

        localStorage.setItem('dgfarmer_token', response.token);
        localStorage.setItem('dgfarmer_user', JSON.stringify(user));
    }

    logout() {
        this.currentUser.set(null);
        this.token.set(null);
        localStorage.removeItem('dgfarmer_token');
        localStorage.removeItem('dgfarmer_user');
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    getToken(): string | null {
        return this.token();
    }

    isAuthenticated(): boolean {
        return this.token() !== null;
    }

    isFarmer(): boolean {
        return this.currentUser()?.role === 'farmer';
    }

    // Helper to get auth headers
    getAuthHeaders(): HttpHeaders {
        const token = this.token();
        return token
            ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
            : new HttpHeaders();
    }
}
