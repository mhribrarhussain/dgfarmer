# 🌾 Digital Farmer - Frontend

A modern, responsive Angular web application connecting farmers directly with consumers for fresh, organic produce.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### For Buyers
- 🛒 **Browse Products**: View fresh produce with images, prices, and ratings
- 🛍️ **Shopping Cart**: Add items, manage quantities, and checkout
- 📦 **Order Tracking**: View order history and status
- 💬 **Messaging**: Communicate with farmers about orders

### For Farmers
- 📊 **Dashboard**: Manage products and track orders
- ➕ **Product Management**: Add, edit, delete products with image upload
- ✅ **Order Management**: Accept/reject orders from customers
- 💬 **Customer Communication**: Reply to buyer messages

### General
- 🔐 **Authentication**: Secure login/register for farmers and buyers
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🌐 **Mock Backend Mode**: Can run without a backend (uses LocalStorage)

## 🚀 Tech Stack

- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript 5.0
- **Styling**: SCSS with CSS Variables
- **State Management**: RxJS Signals
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Authentication**: JWT-based

## 📁 Project Structure

```
src/app/
├── components/       # Reusable UI components (navbar, footer, product-card)
├── pages/           # Route-level components (home, products, dashboard)
├── services/        # Business logic & API calls
├── models/          # TypeScript interfaces
├── interceptors/    # HTTP interceptors (auth, mock-backend)
└── data/            # Static/seed data
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+ and npm 10+
- Angular CLI 18+

### Local Development (with Backend)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/digiangular.git
   cd digiangular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Edit `src/environments/environment.ts`
   - Set `apiUrl` to your backend URL (e.g., `http://localhost:5004/api`)
   - Set `useMock: false`

4. **Run development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

### Standalone Mode (No Backend Required)

Perfect for demos or when the backend is unavailable!

1. **Enable Mock Mode**
   - Edit `src/environments/environment.ts`
   - Set `useMock: true`

2. **Run the app**
   ```bash
   npm start
   ```

**How it works**: The app uses browser LocalStorage to simulate a database. All data persists in your browser until you clear cache.

**Demo Accounts** (auto-seeded):
- Farmer: `farmer@test.com` (password: anything)
- Buyer: `buyer@test.com` (password: anything)

## 🌐 Deployment

### Deploy to Netlify

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Push code to GitHub
   - Connect repo in Netlify dashboard
   - Set build command: `npm run build`
   - Set publish directory: `dist/digital-farmer/browser`

3. **Configure Environment**
   - In `environment.prod.ts`, set `useMock: true` for frontend-only deployment
   - Or set `apiUrl` to your deployed backend URL

The app will automatically use mock mode in production (as configured in `environment.prod.ts`).

## 📸 Screenshots

### Home Page
Beautiful landing page with hero section and featured products.

### Product Catalog
Browse all products with filtering and search.

### Farmer Dashboard
Manage products, accept/reject orders, and communicate with buyers.

### Shopping Cart
Add items, adjust quantities, and checkout.

## 🔑 Key Technical Decisions

### 1. **Standalone Components**
Uses Angular's modern standalone API (no NgModule). Benefits:
- Faster builds
- Better tree-shaking
- Simpler code

### 2. **Signal-based State**
Uses Angular Signals for reactive state management:
```typescript
products = signal<Product[]>([]);
cartCount = computed(() => this.cartItems().length);
```

### 3. **Mock Backend Interceptor**
HTTP interceptor that simulates backend responses using LocalStorage:
- Enables frontend-only deployment
- Great for demos and testing
- No backend setup required

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Inspiration from modern e-commerce platforms
