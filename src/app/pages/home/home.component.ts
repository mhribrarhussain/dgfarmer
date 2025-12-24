import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private productService = inject(ProductService);

    featuredProducts = signal<Product[]>([]);
    isLoading = signal(true);

    features = [
        {
            icon: '🌱',
            title: 'Fresh from Farm',
            description: 'Products harvested and delivered within 24 hours for maximum freshness.'
        },
        {
            icon: '👨‍🌾',
            title: 'Direct from Farmers',
            description: 'Buy directly from local farmers. Fair prices for you and them.'
        },
        {
            icon: '🚚',
            title: 'Fast Delivery',
            description: 'Quick and reliable delivery right to your doorstep.'
        },
        {
            icon: '✅',
            title: 'Quality Assured',
            description: 'All products are quality checked before delivery.'
        }
    ];

    testimonials = [
        {
            name: 'Aisha Bibi',
            role: 'Home Chef',
            text: 'The vegetables are so fresh! I can taste the difference in my cooking.',
            avatar: '👩'
        },
        {
            name: 'Muhammad Ali',
            role: 'Restaurant Owner',
            text: 'Digital Farmer has transformed how I source ingredients. Reliable and fresh!',
            avatar: '👨'
        },
        {
            name: 'Fatima Khan',
            role: 'Health Enthusiast',
            text: 'Finally, organic produce I can trust. Great prices too!',
            avatar: '👩'
        }
    ];

    ngOnInit() {
        this.productService.getFeatured().subscribe(products => {
            this.featuredProducts.set(products);
            this.isLoading.set(false);
        });
    }
}
