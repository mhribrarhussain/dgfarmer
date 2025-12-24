import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems: CartItem[] = [];
    private cartSubject = new BehaviorSubject<CartItem[]>([]);

    cart$ = this.cartSubject.asObservable();

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const stored = localStorage.getItem('digitalFarmerCart');
        if (stored) {
            this.cartItems = JSON.parse(stored);
            this.cartSubject.next(this.cartItems);
        }
    }

    private saveToStorage(): void {
        localStorage.setItem('digitalFarmerCart', JSON.stringify(this.cartItems));
        this.cartSubject.next(this.cartItems);
    }

    addToCart(product: Product, quantity: number = 1): void {
        const existingItem = this.cartItems.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({ product, quantity });
        }

        this.saveToStorage();
    }

    removeFromCart(productId: number): void {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
        this.saveToStorage();
    }

    updateQuantity(productId: number, quantity: number): void {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
            }
        }
    }

    getCartItems(): CartItem[] {
        return this.cartItems;
    }

    getTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    getItemCount(): number {
        return this.cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart(): void {
        this.cartItems = [];
        this.saveToStorage();
    }
}
