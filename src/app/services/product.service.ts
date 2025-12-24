import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../data/products.data';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: Product[] = PRODUCTS;

    getAll(): Product[] {
        return this.products;
    }

    getById(id: number): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    getByCategory(category: string): Product[] {
        if (category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    }

    search(query: string): Product[] {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.farmer.toLowerCase().includes(lowerQuery)
        );
    }

    getFeatured(): Product[] {
        return this.products.filter(p => p.rating >= 4.7).slice(0, 4);
    }

    getCategories(): string[] {
        return ['all', 'vegetables', 'fruits', 'grains', 'dairy'];
    }
}
