import { Component, inject, OnInit } from '@angular/core';
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

    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories = this.productService.getCategories();
    selectedCategory = 'all';
    searchQuery = '';
    sortBy = 'name';

    ngOnInit() {
        this.products = this.productService.getAll();
        this.filteredProducts = this.products;

        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.selectedCategory = params['category'];
                this.filterProducts();
            }
        });
    }

    filterProducts() {
        let result = this.selectedCategory === 'all'
            ? this.products
            : this.productService.getByCategory(this.selectedCategory);

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.farmer.toLowerCase().includes(query)
            );
        }

        this.sortProducts(result);
    }

    sortProducts(products: Product[]) {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts = [...products].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts = [...products].sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts = [...products].sort((a, b) => b.rating - a.rating);
                break;
            default:
                this.filteredProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    onCategoryChange(category: string) {
        this.selectedCategory = category;
        this.filterProducts();
    }

    onSearch() {
        this.filterProducts();
    }

    onSortChange() {
        this.filterProducts();
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
