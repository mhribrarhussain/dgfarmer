import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateOrderDto, Order } from '../models/order.model';
import { Message, SendMessage } from '../models/message.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/orders`;

    placeOrder(order: CreateOrderDto): Observable<Order[]> {
        return this.http.post<Order[]>(this.apiUrl, order);
    }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getReceivedOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/received`);
    }

    acceptOrder(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${orderId}/accept`, {});
    }

    rejectOrder(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${orderId}/reject`, {});
    }

    cancelOrder(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${orderId}/cancel`, {});
    }

    // Messaging
    getMessages(orderId: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/${orderId}/messages`);
    }

    sendMessage(orderId: number, content: string): Observable<Message> {
        return this.http.post<Message>(`${this.apiUrl}/${orderId}/messages`, { content });
    }
}
