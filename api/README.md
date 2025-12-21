# Salary Split API

A REST API performing CRUD actions for the SalarySplit app, designed to help users organise their monthly salary distribution across bills, expenses, savings, and multiple accounts. The frontend, which this API serves, is in [this repository](https://github.com/franciskershaw/salary-split)

## Purpose

This API serves as the backend for a salary split application that helps users:

- Automatically allocate their take-home pay across different financial obligations
- Track bills and expenses with due dates and categories
- Manage multiple bank accounts and investment accounts
- Set and monitor savings goals
- Split expenses between multiple people (e.g., roommates, partners)

## Core Features

### User Management

- **Authentication**: Google OAuth 2.0 and local email/password authentication
- **User Profiles**: Store salary information, pay dates, currency preferences, and themes
- **Customisable Filters**: Enable/disable account types and bill categories per user

### Account Management

- **Multiple Account Types**: Current, Savings, Investment, and Joint accounts
- **Fund Flow Control**: Configure which accounts can receive funds and salary deposits
- **Target Monthly Amounts**: Set savings goals with flexible splitting options

### Bill & Expense Tracking

- **Comprehensive Categories**: 15+ categories including housing, utilities, transport, entertainment, etc.
- **Due Date Management**: Track bills by monthly due dates (1-31)
- **Account Assignment**: Link each bill/expense to specific accounts for payment
- **Expense Splitting**: Divide costs between multiple people (1-10 people)
- **Reordering**: Custom ordering for prioritized bill payment

### Savings Management

- **Goal Setting**: Define target monthly savings amounts
- **Flexible Splitting**: Distribute savings across multiple people or accounts
- **Progress Tracking**: Monitor savings accumulation over time

### Cross-Feature Operations

- **Amount Updates**: Unified system for updating amounts across all financial items
- **Bulk Operations**: Reorder bills, expenses, and savings efficiently
- **Real-time Calculations**: Automatic recalculation of available funds and allocations

## Tech Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (JWT, Google OAuth, Local Strategy)
- **Validation**: Joi for request validation
- **Security**: Helmet, CORS, bcrypt for password hashing
- **Development**: ts-node-dev for hot reloading
- **Containerization**: Docker and Docker Compose

## 📁 Project Structure

```
src/
├── core/                    # Core application configuration
│   ├── config/             # Database and passport configuration
│   ├── middleware/         # Error handling middleware
│   └── utils/              # Constants, validation, JWT utilities
├── features/               # Feature-based modules
│   ├── auth/               # Authentication (login, register, OAuth)
│   ├── users/              # User management and preferences
│   ├── accounts/           # Bank account management
│   ├── bills/              # Bill tracking and management
│   ├── expenses/           # Expense tracking
│   ├── savings/            # Savings goals management
│   └── shared/             # Cross-feature operations
└── server.ts               # Application entry point
```

Each feature module contains:

- `controllers/`: Request handlers and business logic
- `model/`: Mongoose schemas and interfaces
- `routes/`: Express route definitions
- `validation/`: Joi validation schemas

## Getting Started

### Prerequisites

- Node.js (v22.5.1 or higher)
- MongoDB (v8.0.9 or higher)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/salary-split-api-dev

# JWT Secrets
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS Origins
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_NETWORK=http://your-network-ip:5173

# Server Configuration
PORT=5300
NODE_ENV=development
```

### Installation & Development

#### Local Development

```bash
# Install dependencies
npm install

# Start with local MongoDB
npm run dev:local

# Start with MongoDB from Docker Compose
npm run dev

# Start for network access (useful for mobile testing)
npm run dev:network
```

#### Docker Development

```bash
# Start both API and MongoDB in containers
npm run dev:docker

# This will start:
# - MongoDB container on port 27017
# - API container on port 5300
```

#### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Or build and run with Docker
npm run docker:build
npm run docker:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Local user registration
- `POST /api/auth/login` - Local user login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users` - Get current user profile
- `PUT /api/users` - Update user profile
- `PUT /api/users/salary` - Update salary information
- `PUT /api/users/theme` - Update theme preference
- `PUT /api/users/filters` - Update account/bill filters

### Accounts

- `GET /api/accounts` - Get user's accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `PUT /api/accounts/reorder` - Reorder accounts

### Bills

- `GET /api/bills` - Get user's bills
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `PUT /api/bills/reorder` - Reorder bills

### Expenses

- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/reorder` - Reorder expenses

### Savings

- `GET /api/savings` - Get user's savings
- `POST /api/savings` - Create new savings goal
- `PUT /api/savings/:id` - Update savings goal
- `DELETE /api/savings/:id` - Delete savings goal
- `PUT /api/savings/reorder` - Reorder savings

### Shared Operations

- `PUT /api/update-amount` - Update amounts across different entities

## Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Google OAuth 2.0**: Secure third-party authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Additional security headers
- **Input Validation**: Joi schema validation for all inputs
- **User Isolation**: All data is user-scoped and protected

## Supported Categories

### Account Types

- Current, Savings, Investment, Joint

### Bill/Expense Categories

- Housing, Utilities, Communication, Entertainment
- Insurance, Transport, Financial, Healthcare
- Business, Education, Food, Personal
- Gifts, Holidays, Other

### Currencies

- GBP (British Pound)
- USD (US Dollar)
- EUR (Euro)

## Author

Francis Kershaw - [GitHub Profile](https://github.com/franciskershaw)
