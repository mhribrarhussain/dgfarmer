import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
    @Input() product!: Product;

    private cartService = inject(CartService);

    addToCart(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.cartService.addToCart(this.product, 1);
    }

    getCategoryIcon(): string {
        const icons: Record<string, string> = {
            vegetables: '🥬',
            fruits: '🍎',
            grains: '🌾',
            dairy: '🥛'
        };
        return icons[this.product.category] || '📦';
    }
}
