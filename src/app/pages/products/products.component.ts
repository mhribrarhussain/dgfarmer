import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, ProductCardComponent],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);

    products = signal<Product[]>([]);
    filteredProducts = signal<Product[]>([]);
    categories = signal<string[]>(['all', 'vegetables', 'fruits', 'grains', 'dairy']);
    isLoading = signal(true);

    selectedCategory = 'all';
    searchQuery = '';
    sortBy = 'name';

    ngOnInit() {
        // Load categories from API
        this.productService.getCategories().subscribe(cats => {
            this.categories.set(cats);
        });

        // Check for category in query params
        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.selectedCategory = params['category'];
            }
            this.loadProducts();
        });
    }

    loadProducts() {
        this.isLoading.set(true);
        const category = this.selectedCategory === 'all' ? undefined : this.selectedCategory;
        const search = this.searchQuery || undefined;

        this.productService.getAll(category, search).subscribe(products => {
            this.products.set(products);
            this.sortProducts(products);
            this.isLoading.set(false);
        });
    }

    sortProducts(products: Product[]) {
        let sorted: Product[];
        switch (this.sortBy) {
            case 'price-low':
                sorted = [...products].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted = [...products].sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted = [...products].sort((a, b) => b.rating - a.rating);
                break;
            default:
                sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
        }
        this.filteredProducts.set(sorted);
    }

    onCategoryChange(category: string) {
        this.selectedCategory = category;
        this.loadProducts();
    }

    onSearch() {
        this.loadProducts();
    }

    onSortChange() {
        this.sortProducts(this.products());
    }

    getCategoryIcon(category: string): string {
        const icons: Record<string, string> = {
            all: '🛒',
            vegetables: '🥬',
            fruits: '🍎',
            grains: '🌾',
            dairy: '🥛'
        };
        return icons[category] || '📦';
    }
}
