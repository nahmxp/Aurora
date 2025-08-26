# Aurora - Digital Knowledge Platform

<p align="center">
  <img src="public/images/Icon.png" alt="Aurora Logo" width="120">
</p>

<p align="center">
  <b>The Dawn of Knowledge: A Modern Digital Library Platform</b>
</p>

Aurora is a comprehensive digital library and e-learning platform built with modern web technologies. It provides a seamless reading experience across three audience segments: Kids, Adults, and Higher Education. The platform combines intuitive browsing with powerful search capabilities, secure authentication, and a sophisticated content delivery system.

## 📚 Project Overview

Aurora transforms the traditional library experience into a digital realm, offering an extensive catalog of books, academic papers, and educational resources. The platform focuses on:

- **Audience-Targeted Content**: Specialized sections for Kids, Adults, and Higher Education
- **Digital-First Experience**: Robust support for various digital content formats 
- **User-Centric Design**: Intuitive interfaces with personalized libraries and reading preferences
- **Educational Focus**: Academic tools including DOI referencing and citation capabilities

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (React)
- **Styling**: CSS-in-JS with styled-jsx, custom theming system
- **State Management**: React Context API with custom hooks
- **Responsive Design**: Mobile-first approach with media queries

### Backend
- **API Framework**: Next.js API routes (serverless functions)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT implementation with HTTP-only cookies
- **Content Delivery**: Dynamic content serving with content-type specific viewers

### Payment Processing
- **Provider**: Stripe integration for secure payments
- **Webhook System**: Asynchronous order processing via webhooks

### Deployment & Infrastructure
- **Hosting**: Vercel for both frontend and serverless functions
- **Image Storage**: Optimized image delivery system
- **CI/CD**: Automated deployments via GitHub integration

## 🔍 Core Features

### 1. Audience-Specific Content Discovery
- **Home Page Sections**: Dedicated sections for Kids, Adults, and Higher Education
- **Advanced Filtering**: Filter by age range, academic level, category, format
- **Smart Search**: Full-text search with relevance ranking
- **Category Navigation**: Intuitive browsing by subject and interest areas

### 2. Digital Content System
- **Multiple Formats**: Support for PDF, EPUB, DOC(X), TXT formats
- **Academic Resources**: DOI integration for scholarly articles and research papers
- **External Resources**: Linking capability to external educational platforms
- **Content Security**: Access control based on purchase history and user permissions

### 3. User Management
- **Account System**: Registration, authentication, and profile management
- **Role-Based Access**: User/Admin permission system
- **Personal Libraries**: User-specific book collections and reading history
- **Reading Progress**: Save and resume reading positions

### 4. E-Commerce Capabilities
- **Shopping Cart**: Add and manage multiple items
- **Wishlist**: Save items for future purchase consideration
- **Checkout Process**: Streamlined, secure payment flow
- **Order Management**: Track order status and history

### 5. Admin Dashboard
- **Content Management**: Add, edit, and remove books
- **User Management**: Manage user accounts and permissions
- **Order Processing**: Monitor and update order status
- **Analytics**: Basic reporting on popular content and user activity

### 6. Reading Experience
- **In-Browser Reader**: View PDFs and documents directly in browser
- **Accessibility Features**: Text size adjustment, color themes
- **Bookmarks & Notes**: Save positions and add personal notes (premium feature)
- **Mobile Optimization**: Responsive reading experience across devices

## 📁 Project Structure

```
Aurora/
├── components/            # Reusable UI components
│   ├── CategoryTabs.js    # Audience category navigation tabs
│   ├── FilterBar.js       # Content filtering system
│   ├── ImageCarousel.js   # Image slideshow component
│   ├── Layout.js          # Main app layout with navigation
│   ├── PriceRangeFilter.js# Price range selector component
│   ├── ProductCard.js     # Book display card component
│   ├── ProductSlider.js   # Horizontal scrolling book list
│   ├── SearchBar.js       # Global search interface
│   └── ThemeToggle.js     # Light/dark mode toggle
│
├── lib/                   # Core utilities and context providers
│   ├── auth.js            # Authentication utilities
│   ├── AuthContext.js     # Auth state management
│   ├── checkAdminAuth.js  # Admin authentication middleware
│   ├── email.js           # Email notification system
│   ├── middleware.js      # Request middleware
│   ├── mongodb.js         # Database connection manager
│   ├── session.js         # Session handling
│   ├── ThemeContext.js    # Theme state management
│   ├── withAdminAuth.js   # Admin route protection HOC
│   └── withAuth.js        # User route protection HOC
│
├── models/                # MongoDB schemas
│   ├── Cart.js            # Shopping cart model
│   ├── Order.js           # Order processing model
│   ├── Product.js         # Book/product model
│   ├── User.js            # User account model
│   └── Wishlist.js        # User wishlist model
│
├── pages/                 # Application routes and API endpoints
│   ├── _app.js            # Next.js app initialization
│   ├── _document.js       # HTML document customization
│   ├── about.js           # About page
│   ├── add-product.js     # Add new book page (admin)
│   ├── all-orders.js      # Order management (admin)
│   ├── cart.js            # Shopping cart page
│   ├── catalog.js         # Main book browsing interface
│   ├── checkout.js        # Payment processing
│   ├── contact.js         # Contact information page
│   ├── dashboard.js       # Admin dashboard
│   ├── home.js            # Homepage with audience sections
│   ├── index.js           # Root route (redirects to home)
│   ├── login.js           # User authentication
│   ├── my-library.js      # User's purchased books
│   ├── orders.js          # User's order history
│   ├── profile.js         # User profile management
│   ├── signup.js          # New user registration
│   ├── wishlist.js        # User's saved items
│   │
│   ├── api/               # Backend API routes
│   │   ├── orders.js      # Order management endpoints
│   │   ├── products.js    # Book catalog endpoints
│   │   ├── seed-books.js  # Database seeding utility
│   │   ├── seed-orders.js # Test order generation
│   │   ├── transactions.js# Payment processing
│   │   ├── users.js       # User management
│   │   │
│   │   ├── admin/         # Admin-only endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── books/         # Book content endpoints
│   │   ├── order/         # Order processing
│   │   ├── payment/       # Payment processing
│   │   ├── product/       # Product details
│   │   └── user/          # User data endpoints
│   │
│   ├── brand/             # Publisher/brand pages
│   ├── category/          # Category browsing pages
│   ├── product/           # Product detail pages
│   ├── reader/            # Digital content reader
│   └── update-product/    # Product editing (admin)
│
├── public/                # Static assets
│   └── images/            # Image assets
│
└── styles/                # Global styles
    └── globals.css        # Application-wide CSS
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- NPM or Yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/nahmxp/Aurora.git
cd Aurora
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Access the application at `http://localhost:3000`

## 📋 User Roles & Permissions

### Regular User
- Browse the catalog
- Filter by audience (Kids, Adults, Higher Education)
- Search for books
- Add books to wishlist
- Purchase books
- Access digital content for purchased items
- View order history
- Manage personal profile

### Administrator
- All regular user capabilities
- Add/edit/remove books from catalog
- Manage user accounts
- Process orders
- View platform analytics
- Access admin dashboard

## 🔄 Workflow Examples

### User Purchase Flow
1. Browse catalog or search for books
2. Filter by target audience (Kids/Adults/Higher Education)
3. Add desired books to cart
4. Proceed to checkout
5. Complete payment with Stripe
6. Access purchased content in "My Library"

### Content Management Flow (Admin)
1. Login with admin credentials
2. Navigate to "Add Book" page
3. Enter book details including:
   - Title, author, description
   - Target audience and age range (for Kids section)
   - Digital content links or uploads
   - Pricing information
4. Submit to add to catalog
5. Edit or remove via product management interface

## 🤝 Contributing

We welcome contributions to the Aurora platform! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Project Owner: [nahmxp](https://github.com/nahmxp)

---

<p align="center">
  Aurora - Illuminating the path to knowledge in the digital age
</p>
