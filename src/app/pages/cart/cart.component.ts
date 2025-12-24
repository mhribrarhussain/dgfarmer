import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CreateOrderDto } from '../../models/order.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartService = inject(CartService);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private router = inject(Router);

    // Checkout fields
    shippingAddress = '';
    phone = '';
    note = '';
    isCheckingOut = false;
    checkoutError = '';

    constructor() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.shippingAddress = user.address || '';
            this.phone = user.phone || '';
        }
    }

    get subtotal(): number {
        return this.cartService.getTotal();
    }

    get shipping(): number {
        return this.subtotal > 500 ? 0 : 50;
    }

    get total(): number {
        return this.subtotal + this.shipping;
    }

    updateQuantity(productId: number, change: number) {
        const items = this.cartService.getCartItems();
        const item = items.find(i => i.product.id === productId);
        if (item) {
            this.cartService.updateQuantity(productId, item.quantity + change);
        }
    }

    removeItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }

    clearCart() {
        this.cartService.clearCart();
    }

    checkout() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        if (!this.shippingAddress || !this.phone) {
            this.checkoutError = 'Please provide shipping address and phone number.';
            return;
        }

        this.isCheckingOut = true;
        this.checkoutError = '';

        const orderDto: CreateOrderDto = {
            items: this.cartService.getCartItems().map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            })),
            shippingAddress: this.shippingAddress,
            phone: this.phone,
            note: this.note
        };

        this.orderService.placeOrder(orderDto).subscribe({
            next: (order) => {
                this.cartService.clearCart();
                this.router.navigate(['/my-orders']);
            },
            error: (err) => {
                this.isCheckingOut = false;
                this.checkoutError = 'Failed to place order. Please try again.';
                console.error(err);
            }
        });
    }
}
