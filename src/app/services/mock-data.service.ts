import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Order, CreateOrderDto, OrderItem } from '../models/order.model';
import { Message } from '../models/message.model';

export interface LoginDto {
    email: string;
    password?: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password?: string;
    role: 'farmer' | 'buyer';
}

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    private readonly STORAGE_KEYS = {
        USERS: 'db_users',
        PRODUCTS: 'db_products',
        ORDERS: 'db_orders',
        MESSAGES: 'db_messages',
        CURRENT_USER: 'db_current_user'
    };

    constructor() {
        this.initDb();
    }

    private initDb() {
        if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
            this.seedProducts();
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
            this.seedUsers();
        }
    }

    // --- Users ---
    getUsers(): User[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    }

    register(dto: RegisterDto): User {
        const users = this.getUsers();

        // Check if email exists
        if (users.find(u => u.email === dto.email)) {
            throw new Error('Email already exists');
        }

        const newUser: any = {
            id: users.length + 1,
            name: dto.name,
            email: dto.email,
            role: dto.role,
            token: 'mock-jwt-token-' + Date.now()
        };

        users.push(newUser);
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        return newUser;
    }

    login(dto: LoginDto): any | null {
        const users = this.getUsers();
        const user: any = users.find(u => u.email === dto.email);

        if (user) {
            user.token = 'mock-jwt-token-' + Date.now();
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        return null;
    }

    // --- Products ---
    getProducts(): Product[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRODUCTS) || '[]');
    }

    addProduct(product: Partial<Product>): Product {
        const products = this.getProducts();
        const newProduct: any = {
            ...product,
            id: products.length + 1
        };
        products.push(newProduct);
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return newProduct;
    }

    // --- Orders ---
    getOrders(): Order[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS) || '[]');
    }

    placeOrder(dto: CreateOrderDto, userId: number): Order {
        const orders = this.getOrders();
        const products = this.getProducts();

        let total = 0;
        const orderItems: any[] = dto.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error('Product not found');

            total += product.price * item.quantity;

            return {
                id: Math.floor(Math.random() * 10000),
                orderId: 0,
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            };
        });

        const newOrder: Order = {
            id: orders.length + 1,
            userId: userId,
            status: 'pending',
            total: total,
            createdAt: new Date(),
            items: orderItems
        };

        newOrder.items.forEach(i => ((i as any).orderId = newOrder.id));

        orders.push(newOrder);
        localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return newOrder;
    }

    // --- Messages ---
    getMessages(orderId: number): Message[] {
        const allMessages = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.MESSAGES) || '[]');
        return allMessages.filter((m: any) => m.orderId === +orderId);
    }

    sendMessage(orderId: number, content: string, sender: any): Message {
        const allMessages = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.MESSAGES) || '[]');

        const newMessage: Message = {
            id: allMessages.length + 1,
            orderId: +orderId,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            content: content,
            createdAt: new Date()
        };

        allMessages.push(newMessage);
        localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
        return newMessage;
    }

    // --- Seeding ---
    private seedUsers() {
        const users: any[] = [
            { id: 1, name: 'Farmer Ahmed', email: 'farmer@test.com', role: 'farmer', token: '' },
            { id: 2, name: 'Buyer Ali', email: 'buyer@test.com', role: 'buyer', token: '' },
            { id: 3, name: 'Demo Farmer', email: 'demo@farmer.com', role: 'farmer', token: '' }
        ];
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    private seedProducts() {
        const products: any[] = [
            { id: 1, name: 'Fresh Organic Tomatoes', description: 'Locally grown organic tomatoes', price: 120, category: 'vegetables', unit: 'kg', stock: 50, rating: 4.5, farmerId: 1, image: 'https://images.unsplash.com/photo-1546470427-227c7068e771?w=400' },
            { id: 2, name: 'Farm Fresh Eggs', description: 'Free-range chicken eggs', price: 280, category: 'dairy', unit: 'dozen', stock: 30, rating: 4.8, farmerId: 1, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
            { id: 3, name: 'Organic Honey', description: 'Pure natural honey', price: 850, category: 'other', unit: 'kg', stock: 20, rating: 4.9, farmerId: 1, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' },
            { id: 4, name: 'Fresh Spinach', description: 'Organic leafy spinach', price: 60, category: 'vegetables', unit: 'bundle', stock: 40, rating: 4.3, farmerId: 1, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
            { id: 5, name: 'Red Apples', description: 'Sweet and crispy red apples', price: 180, category: 'fruits', unit: 'kg', stock: 35, rating: 4.6, farmerId: 1, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
            { id: 6, name: 'Basmati Rice', description: 'Premium quality basmati rice', price: 320, category: 'grains', unit: 'kg', stock: 100, rating: 4.7, farmerId: 1, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
        ];
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
}
