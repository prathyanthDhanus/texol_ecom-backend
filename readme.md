# E-Commerce Backend API

A robust Node.js/TypeScript backend API for an e-commerce platform with authentication, product management, cart functionality, and real-time notifications.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 🛍️ **Product Management**: CRUD operations for products with image upload
- 🛒 **Shopping Cart**: Full cart functionality with stock validation
- 📦 **Order Management**: Complete order lifecycle management
- 📊 **Category Management**: Product categorization system
- 🔔 **Real-time Notifications**: Socket.IO integration for live updates
- 📈 **Stock Monitoring**: Automated stock alerts and monitoring
- 🖼️ **Image Upload**: Cloudinary integration for product images
- ✅ **Input Validation**: Joi schema validation
- 🛡️ **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e_com-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URL=mongodb://localhost:27017/e-commerce_texol
   
   # JWT Secrets
   USER_SECRET_KEY=your_user_jwt_secret_here
   ADMIN_SECRET_KEY=your_admin_jwt_secret_here
   JWT_EXPIRES_IN=1d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin only)
- `PUT /api/v1/categories/:id` - Update category (Admin only)
- `PATCH /api/v1/categories/:id` - Delete category (Admin only)
- `PATCH /api/v1/categories/:id/restore` - Restore category (Admin only)

### Products
- `GET /api/v1/products` - Get all products (includes stock status)
- `GET /api/v1/products/:id` - Get single product (includes stock status)
- `POST /api/v1/products` - Create product (Admin only)
- `PUT /api/v1/products/:id` - Update product (Admin only)
- `PATCH /api/v1/products/:id` - Delete product (Admin only)
- `PATCH /api/v1/products/:id/restore` - Restore product (Admin only)

### Cart
- `GET /api/v1/cart` - Get user's cart (includes stock status for each item)
- `POST /api/v1/cart/add` - Add item to cart (validates stock availability)
- `PUT /api/v1/cart/update/:itemId` - Update cart item quantity (validates stock availability)
- `DELETE /api/v1/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear entire cart

### Stock Management
- `GET /api/v1/stock/report` - Get comprehensive stock report
- `GET /api/v1/stock/status/:status` - Get products by stock status (in-stock, low-stock, out-of-stock)
- `GET /api/v1/stock/low-stock` - Get low stock products
- `GET /api/v1/stock/out-of-stock` - Get out of stock products
- `PUT /api/v1/stock/:productId` - Update product stock
- `PATCH /api/v1/stock/:productId/threshold` - Set stock threshold
- `POST /api/v1/stock/bulk-update` - Bulk update multiple products
- `GET /api/v1/stock/:productId/history` - Get stock history for a product
- `POST /api/v1/stock/monitor` - Trigger stock monitoring

### Orders
- `GET /api/v1/orders` - Get orders (user's own or all for admin)
- `GET /api/v1/orders/:id` - Get specific order
- `POST /api/v1/orders` - Create new order (validates stock availability)
- `PUT /api/v1/orders/:id` - Update order (Admin only)
- `DELETE /api/v1/orders/:id` - Delete order (Admin only)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control

- **User**: Can manage their own cart, place orders, view their orders
- **Admin**: Full access to all endpoints, can manage products, categories, orders, and stock

## Real-time Features

The API includes Socket.IO for real-time features:

- **Order Updates**: Real-time order status updates
- **Stock Alerts**: Low stock notifications for admins
- **Inventory Updates**: Live inventory changes
- **Product Updates**: Real-time product modifications

## Error Handling

The API includes comprehensive error handling:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource not found)
- **409**: Conflict (resource already exists)
- **500**: Internal Server Error

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Project Structure

```
src/
├── app/                    # Application modules
│   ├── auth/              # Authentication module
│   ├── cart/              # Shopping cart module
│   ├── category/          # Category management
│   ├── order/             # Order management
│   ├── product/           # Product management
│   └── stock/             # Stock management module
├── utils/                 # Utility functions
│   ├── cloudinary/        # File upload utilities
│   ├── customError/       # Error handling
│   ├── helper/            # Helper functions
│   ├── middleware/        # Express middleware
│   └── soket/             # Socket.IO utilities
├── app.ts                 # Express app configuration
├── routes.ts              # Main router
└── server.ts              # Server entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



