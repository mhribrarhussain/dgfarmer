import { Component, inject, OnInit, signal } from '@angular/core';
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

    product = signal<Product | null>(null);
    relatedProducts = signal<Product[]>([]);
    isLoading = signal(true);
    quantity = 1;
    addedToCart = false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            this.loadProduct(id);
        });
    }

    loadProduct(id: number) {
        this.isLoading.set(true);

        this.productService.getById(id).subscribe(product => {
            if (product) {
                this.product.set(product);

                // Load related products
                this.productService.getAll(product.category).subscribe(products => {
                    const related = products
                        .filter((p: Product) => p.id !== id)
                        .slice(0, 4);
                    this.relatedProducts.set(related);
                    this.isLoading.set(false);
                });
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
        const prod = this.product();
        if (prod && this.quantity < prod.stock) {
            this.quantity++;
        }
    }

    addToCart() {
        const prod = this.product();
        if (prod) {
            this.cartService.addToCart(prod, this.quantity);
            this.addedToCart = true;
            setTimeout(() => this.addedToCart = false, 2000);
        }
    }

    getCategoryIcon(): string {
        const prod = this.product();
        if (!prod) return '📦';
        const icons: Record<string, string> = {
            vegetables: '🥬',
            fruits: '🍎',
            grains: '🌾',
            dairy: '🥛'
        };
        return icons[prod.category] || '📦';
    }
}
