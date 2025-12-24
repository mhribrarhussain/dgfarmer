import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-consumer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
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

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'delivered': 'status-success',
            'processing': 'status-warning',
            'pending': 'status-pending',
            'cancelled': 'status-danger'
        };
        return classes[status.toLowerCase()] || 'status-pending';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
