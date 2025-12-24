import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    user = this.authService.getCurrentUser();
    products = signal<Product[]>([]);
    orders = signal<Order[]>([]);

    // Stats signals
    totalProducts = signal(0);
    totalSales = signal(0);
    activeOrdersCount = signal(0);

    showAddModal = false;
    newProduct = {
        name: '',
        description: '',
        price: 0,
        category: 'vegetables' as const,
        unit: 'kg',
        stock: 10,
        image: ''
    };

    ngOnInit() {
        if (!this.authService.isAuthenticated() || !this.authService.isFarmer()) {
            this.router.navigate(['/login']);
            return;
        }

        // Load farmer's products
        this.productService.getMyProducts().subscribe(products => {
            this.products.set(products);
            this.totalProducts.set(products.length);
        });

        // Load farmer's received orders
        this.orderService.getReceivedOrders().subscribe(orders => {
            this.orders.set(orders);
            this.activeOrdersCount.set(orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length);

            // Calculate total sales from delivered orders
            // Note: This matches simple assumption that Total matches items. 
            // In real app we would sum only this farmer's items.
            // Backend now filters OrderItems to only show this farmer's products, so we can sum those up.

            let total = 0;
            orders.forEach(order => {
                if (order.status !== 'cancelled') {
                    // Sum items in this order
                    const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    total += orderTotal;
                }
            });
            this.totalSales.set(total);
        });
    }

    get stats() {
        return [
            { label: 'Total Products', value: this.totalProducts().toString(), icon: '📦', change: '+2' },
            { label: 'Total Sales', value: 'Rs. ' + this.totalSales(), icon: '💰', change: '+15%' },
            { label: 'Active Orders', value: this.activeOrdersCount().toString(), icon: '🛒', change: '+3' },
            { label: 'Customer Rating', value: '4.8', icon: '⭐', change: '+0.2' }
        ];
    }

    openAddModal() {
        this.showAddModal = true;
    }

    closeAddModal() {
        this.showAddModal = false;
        this.newProduct = { name: '', description: '', price: 0, category: 'vegetables', unit: 'kg', stock: 10, image: '' };
    }

    addProduct() {
        this.productService.createProduct(this.newProduct).subscribe(product => {
            if (product) {
                this.products.update(products => [...products, product]);
                this.totalProducts.update(n => n + 1);
                this.closeAddModal();
            }
        });
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'delivered': 'status-success',
            'processing': 'status-warning',
            'pending': 'status-pending'
        };
        return classes[status.toLowerCase()] || '';
    }

    // Image handling
    imagePreview: string | null = null;

    onImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview = e.target?.result as string;
                this.newProduct.image = this.imagePreview; // Use base64 for now
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        this.imagePreview = null;
        this.newProduct.image = '';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
