export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy';
  image: string;
  farmer: string;
  unit: string;
  stock: number;
  rating: number;
}
