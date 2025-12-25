import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Message } from '../../models/message.model';

@Component({
    selector: 'app-consumer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './consumer-dashboard.component.html',
    styleUrl: './consumer-dashboard.component.scss'
})
export class ConsumerDashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    user = this.authService.getCurrentUser();
    orders = signal<Order[]>([]);
    isLoading = signal(true);

    // Messaging
    expandedOrderId: number | null = null;
    messages: Record<number, Message[]> = {};
    newMessage: Record<number, string> = {};
    loadingMessages: Record<number, boolean> = {};

    ngOnInit() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        this.loadOrders();
    }

    loadOrders() {
        this.isLoading.set(true);
        this.orderService.getMyOrders().subscribe({
            next: (orders) => {
                this.orders.set(orders);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load orders', err);
                this.isLoading.set(false);
            }
        });
    }

    toggleMessages(orderId: number) {
        if (this.expandedOrderId === orderId) {
            this.expandedOrderId = null;
        } else {
            this.expandedOrderId = orderId;
            if (!this.messages[orderId]) {
                this.loadMessages(orderId);
            }
        }
    }

    loadMessages(orderId: number) {
        this.loadingMessages[orderId] = true;
        this.orderService.getMessages(orderId).subscribe({
            next: (messages) => {
                this.messages[orderId] = messages;
                this.loadingMessages[orderId] = false;
            },
            error: () => {
                this.loadingMessages[orderId] = false;
            }
        });
    }

    sendMessage(orderId: number) {
        const content = this.newMessage[orderId]?.trim();
        if (!content) return;

        this.orderService.sendMessage(orderId, content).subscribe({
            next: (message) => {
                if (!this.messages[orderId]) {
                    this.messages[orderId] = [];
                }
                this.messages[orderId].push(message);
                this.newMessage[orderId] = '';
            },
            error: (err) => console.error('Failed to send message', err)
        });
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'delivered': 'status-success',
            'processing': 'status-warning',
            'pending': 'status-pending',
            'accepted': 'status-success',
            'rejected': 'status-danger',
            'cancelled': 'status-danger'
        };
        return classes[status.toLowerCase()] || 'status-pending';
    }

    cancelOrder(orderId: number) {
        if (confirm('Are you sure you want to cancel this order?')) {
            this.orderService.cancelOrder(orderId).subscribe({
                next: () => {
                    this.orders.update(orders =>
                        orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
                    );
                },
                error: (err) => console.error('Failed to cancel order', err)
            });
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
