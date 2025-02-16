# MERN E-commerce App

This project is a full-stack e-commerce application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It provides a foundation for building a robust and scalable online store.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

This MERN e-commerce app is designed to demonstrate a modern approach to online store development. It incorporates key features like product browsing, shopping cart functionality, user authentication, and payment integration. 

## Features

- **Product Management**
  - Browse products by category 
  - Detailed product views with images and descriptions 

- **Shopping Cart**
  - Add/remove items
  - Adjust quantities
  - Persistent cart storage
  - Price calculations

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication  

- **Payment Processing**
  - Secure checkout with Stripe
  - Support for multiple payment methods
  - Order confirmation

- **Admin Dashboard**
  - Product inventory management  
  - Sales analytics

- **Technical Features**
  - Responsive design 
  - RESTful API architecture
  - Secure payment processing
  - Image optimization
  - Form validation

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router Dom
- Zustand
- Lucide React
- Recharts
- Framer Motion
- React Hot Toast
- Stripe JS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- Cors
- Cookie Parser
- Jsonwebtoken
- Bcrypt
- Cloudinary
- Stripe Node
- Ioredis
- Sentry

### Development Tools
- Git for version control
- ESLint for code linting
- Prettier for code formatting 
- Postman for API testing

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NazSvn/MERN_e-commerce.git
   cd MERN_e-commerce
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000  # Example port
   MONGO_URI=your_mongodb_uri       
   UPSTASH_REDIS_URL=your_upstash_redis_url
   JWT_SECRET_TOKEN=your_jwt_secret_token
   JWT_REFRESH_TOKEN=your_jwt_refresh_token
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=your_client_url  # e.g., http://localhost:5173 or your deployed frontend URL
   DSN=your_sentry_dsn
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key # For the frontend
   NODE_ENV=development  # or production, etc.
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ``` 

4. **Start the development servers**

   Backend:
   ```bash
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## API Documentation

The following API endpoints are available.  Base URL: `/api`

**Authentication (`/api/auth`):**

*   `POST /signup`: Register a new user.
*   `POST /login`: Log in an existing user.
*   `POST /logout`: Log out the current user.
*   `POST /refresh-token`: Refresh the user's authentication token.
*   `GET /profile`: Get the current user's profile (requires authentication).

**Products (`/api/products`):**

*   `GET /`: Get all products (requires authentication and admin privileges).
*   `GET /featured`: Get featured products.
*   `GET /category/:category`: Get products by category.
*   `GET /recommended`: Get recommended products.
*   `POST /`: Create a new product (requires authentication and admin privileges).
*   `PATCH /:id`: Toggle featured status of a product (requires authentication and admin privileges).
*   `DELETE /:id`: Delete a product (requires authentication and admin privileges).

**Cart (`/api/cart`):**

*   `GET /`: Get products in the user's cart (requires authentication).
*   `POST /`: Add a product to the cart (requires authentication).
*   `DELETE /`: Remove all products from the cart (requires authentication).
*   `PUT /:id`: Update the quantity of a product in the cart (requires authentication).

**Coupons (`/api/coupons`):**

*   `GET /`: Get a coupon (requires authentication). *(Clarify what "get a coupon" means - all coupons? a specific coupon?)*
*   `POST /validate`: Validate a coupon (requires authentication).

**Payments (`/api/payments`):**

*   `POST /create-checkout-session`: Create a Stripe checkout session (requires authentication).
*   `POST /checkout-success`: Handle successful checkout (requires authentication).

**Analytics (`/api/analytics`):**

*   `GET /`: Get analytics data (requires authentication and admin privileges).

**Categories (`/api/category`):**

*   `GET /`: Get all categories.
*   `POST /`: Create a new category (requires authentication and admin privileges).
*   `PATCH /:slug`: Update a category (requires authentication and admin privileges).
*   `DELETE /:slug`: Delete a category (requires authentication and admin privileges).



## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Emmanuel Idler - [contact](emmanuelidler.com)

Project Link: [https://github.com/NazSvn/MERN_e-commerce](https://github.com/NazSvn/MERN_e-commerce)
