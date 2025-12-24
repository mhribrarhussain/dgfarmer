import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartService = inject(CartService);

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
}
