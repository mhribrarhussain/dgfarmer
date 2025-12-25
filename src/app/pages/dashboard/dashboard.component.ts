import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';
import { Message } from '../../models/message.model';

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
    isUploading = false;

    onImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.processFile(input.files[0]);
        }
    }

    onFileDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
            this.processFile(event.dataTransfer.files[0]);
        }
    }

    private processFile(file: File) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        this.isUploading = true;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Simulate upload delay for visual feedback
            setTimeout(() => {
                this.imagePreview = e.target?.result as string;
                this.newProduct.image = this.imagePreview;
                this.isUploading = false;
            }, 500);
        };
        reader.readAsDataURL(file);
    }

    triggerFileInput() {
        document.getElementById('productImage')?.click();
    }

    removeImage() {
        this.imagePreview = null;
        this.newProduct.image = '';
    }

    // Edit Product Modal
    showEditModal = false;
    editProduct = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        category: 'vegetables' as const,
        unit: 'kg',
        stock: 10,
        image: ''
    };

    openEditModal(product: Product) {
        this.editProduct = {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category as any,
            unit: product.unit,
            stock: product.stock,
            image: product.image || ''
        };
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    updateProduct() {
        this.productService.updateProduct(this.editProduct.id, this.editProduct).subscribe(success => {
            if (success) {
                this.products.update(products =>
                    products.map(p => p.id === this.editProduct.id
                        ? { ...p, ...this.editProduct }
                        : p
                    )
                );
                this.closeEditModal();
            }
        });
    }

    deleteProduct(product: Product) {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            this.productService.deleteProduct(product.id).subscribe(success => {
                if (success) {
                    this.products.update(products => products.filter(p => p.id !== product.id));
                    this.totalProducts.update(n => n - 1);
                }
            });
        }
    }

    // Accept Order
    acceptOrder(orderId: number) {
        this.orderService.acceptOrder(orderId).subscribe({
            next: () => {
                this.orders.update(orders =>
                    orders.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o)
                );
                this.activeOrdersCount.set(
                    this.orders().filter(o => o.status === 'pending').length
                );
            },
            error: (err: Error) => console.error('Failed to accept order', err)
        });
    }

    // Reject Order
    rejectOrder(orderId: number) {
        this.orderService.rejectOrder(orderId).subscribe({
            next: () => {
                this.orders.update(orders =>
                    orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o)
                );
                this.activeOrdersCount.set(
                    this.orders().filter(o => o.status === 'pending').length
                );
            },
            error: (err: Error) => console.error('Failed to reject order', err)
        });
    }

    // Messaging
    expandedOrderId: number | null = null;
    messages: Record<number, Message[]> = {};
    newMessage: Record<number, string> = {};
    loadingMessages: Record<number, boolean> = {};

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

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
