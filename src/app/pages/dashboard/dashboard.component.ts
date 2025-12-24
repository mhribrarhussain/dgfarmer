import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private router = inject(Router);

    user = this.authService.getCurrentUser();
    products: Product[] = this.productService.getAll().slice(0, 5);

    showAddModal = false;
    newProduct = {
        name: '',
        description: '',
        price: 0,
        category: 'vegetables' as const,
        unit: 'kg'
    };

    stats = [
        { label: 'Total Products', value: '12', icon: '📦', change: '+2' },
        { label: 'Total Sales', value: 'Rs. 45,200', icon: '💰', change: '+15%' },
        { label: 'Active Orders', value: '8', icon: '🛒', change: '+3' },
        { label: 'Customer Rating', value: '4.8', icon: '⭐', change: '+0.2' }
    ];

    recentOrders = [
        { id: 1001, customer: 'Ali Hassan', items: 3, total: 850, status: 'Delivered' },
        { id: 1002, customer: 'Fatima Shah', items: 2, total: 620, status: 'Processing' },
        { id: 1003, customer: 'Muhammad Khan', items: 5, total: 1200, status: 'Pending' },
        { id: 1004, customer: 'Sara Ahmed', items: 1, total: 350, status: 'Delivered' }
    ];

    constructor() {
        if (!this.authService.isAuthenticated() || !this.authService.isFarmer()) {
            this.router.navigate(['/login']);
        }
    }

    openAddModal() {
        this.showAddModal = true;
    }

    closeAddModal() {
        this.showAddModal = false;
        this.newProduct = { name: '', description: '', price: 0, category: 'vegetables', unit: 'kg' };
    }

    addProduct() {
        // Mock add product
        console.log('Adding product:', this.newProduct);
        this.closeAddModal();
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'Delivered': 'status-success',
            'Processing': 'status-warning',
            'Pending': 'status-pending'
        };
        return classes[status] || '';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
