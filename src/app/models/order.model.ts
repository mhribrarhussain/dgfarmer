export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    status: string;
    total: number;
    shippingAddress: string;
    customerNote?: string;
    createdAt: string;
    items: OrderItem[];
}

export interface CreateOrderDto {
    items: { productId: number; quantity: number }[];
    shippingAddress: string;
    phone?: string;
    note?: string;
}
