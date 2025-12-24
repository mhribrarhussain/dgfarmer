import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateOrderDto, Order } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/orders`;

    placeOrder(order: CreateOrderDto): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getReceivedOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/received`);
    }

    updateStatus(orderId: number, status: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${orderId}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
