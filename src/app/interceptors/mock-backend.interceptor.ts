import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MockDataService } from '../services/mock-data.service';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
    if (!environment.useMock) {
        return next(req);
    }

    const mockService = inject(MockDataService);
    const { url, method, body } = req;

    // Simulate network delay
    const delayMs = 500;

    // --- Auth ---
    if (url.includes('/auth/login') && method === 'POST') {
        const user = mockService.login(body as any);
        if (user) {
            return of(new HttpResponse({ status: 200, body: { token: user.token, user } })).pipe(delay(delayMs));
        }
        return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
    }

    if (url.includes('/auth/register') && method === 'POST') {
        try {
            const user = mockService.register(body as any);
            return of(new HttpResponse({ status: 200, body: { token: user.token, user } })).pipe(delay(delayMs));
        } catch (e) {
            return throwError(() => new HttpErrorResponse({ status: 400, statusText: 'Email exists' }));
        }
    }

    // --- Products ---
    if (url.endsWith('/products') && method === 'GET') {
        return of(new HttpResponse({ status: 200, body: mockService.getProducts() })).pipe(delay(delayMs));
    }

    if (url.endsWith('/products') && method === 'POST') {
        const newProduct = mockService.addProduct(body as any);
        return of(new HttpResponse({ status: 200, body: newProduct })).pipe(delay(delayMs));
    }

    // --- Orders ---
    if (url.endsWith('/orders') && method === 'GET') {
        // In a real app we filter by user, for mock just return all or filter if we tracked current user
        // Simplified: return all orders for now, or assume farmer sees all
        return of(new HttpResponse({ status: 200, body: mockService.getOrders() })).pipe(delay(delayMs));
    }

    if (url.endsWith('/orders') && method === 'POST') {
        // Need logged in user ID. In mock, we can grab it from localStorage or body if we passed it
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user) return throwError(() => new HttpErrorResponse({ status: 401 }));

        const order = mockService.placeOrder(body as any, user.id);
        return of(new HttpResponse({ status: 200, body: order })).pipe(delay(delayMs));
    }

    // --- Messages ---
    // Regex to match orders/{id}/messages
    const msgMatch = url.match(/\/orders\/(\d+)\/messages/);
    if (msgMatch) {
        const orderId = +msgMatch[1];

        if (method === 'GET') {
            return of(new HttpResponse({ status: 200, body: mockService.getMessages(orderId) })).pipe(delay(delayMs));
        }

        if (method === 'POST') {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user) return throwError(() => new HttpErrorResponse({ status: 401 }));

            const msg = mockService.sendMessage(orderId, (body as any).content, user);
            return of(new HttpResponse({ status: 200, body: msg })).pipe(delay(delayMs));
        }
    }

    // Fallback to real backend if no match (or 404)
    return next(req);
};
