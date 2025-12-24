import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getAll(category?: string, search?: string): Observable<Product[]> {
        let url = `${this.apiUrl}/products`;
        const params: string[] = [];

        if (category && category !== 'all') {
            params.push(`category=${category}`);
        }
        if (search) {
            params.push(`search=${search}`);
        }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        return this.http.get<any[]>(url).pipe(
            map(products => products.map(p => this.mapProduct(p))),
            catchError(() => of([]))
        );
    }

    getById(id: number): Observable<Product | null> {
        return this.http.get<any>(`${this.apiUrl}/products/${id}`).pipe(
            map(p => this.mapProduct(p)),
            catchError(() => of(null))
        );
    }

    getFeatured(): Observable<Product[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/featured`).pipe(
            map(products => products.map(p => this.mapProduct(p))),
            catchError(() => of([]))
        );
    }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/products/categories`).pipe(
            map(categories => ['all', ...categories]),
            catchError(() => of(['all', 'vegetables', 'fruits', 'grains', 'dairy']))
        );
    }

    // For farmers only
    createProduct(product: any): Observable<Product | null> {
        return this.http.post<any>(`${this.apiUrl}/products`, product).pipe(
            map(p => this.mapProduct(p)),
            catchError(() => of(null))
        );
    }

    updateProduct(id: number, product: any): Observable<boolean> {
        return this.http.put(`${this.apiUrl}/products/${id}`, product).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    deleteProduct(id: number): Observable<boolean> {
        return this.http.delete(`${this.apiUrl}/products/${id}`).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getMyProducts(): Observable<Product[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/my-products`).pipe(
            map(products => products.map(p => this.mapProduct(p))),
            catchError(() => of([]))
        );
    }

    private mapProduct(p: any): Product {
        return {
            id: p.id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            category: p.category,
            image: p.image || 'https://via.placeholder.com/300',
            farmer: p.farmerName,
            unit: p.unit,
            stock: p.stock,
            rating: p.rating
        };
    }
}
