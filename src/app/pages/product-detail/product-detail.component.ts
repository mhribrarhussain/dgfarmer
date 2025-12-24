import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private cartService = inject(CartService);

    product: Product | undefined;
    relatedProducts: Product[] = [];
    quantity = 1;
    addedToCart = false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            this.product = this.productService.getById(id);

            if (this.product) {
                this.relatedProducts = this.productService
                    .getByCategory(this.product.category)
                    .filter(p => p.id !== id)
                    .slice(0, 4);
            } else {
                this.router.navigate(['/products']);
            }
        });
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    increaseQuantity() {
        if (this.product && this.quantity < this.product.stock) {
            this.quantity++;
        }
    }

    addToCart() {
        if (this.product) {
            this.cartService.addToCart(this.product, this.quantity);
            this.addedToCart = true;
            setTimeout(() => this.addedToCart = false, 2000);
        }
    }

    getCategoryIcon(): string {
        if (!this.product) return '📦';
        const icons: Record<string, string> = {
            vegetables: '🥬',
            fruits: '🍎',
            grains: '🌾',
            dairy: '🥛'
        };
        return icons[this.product.category] || '📦';
    }
}
