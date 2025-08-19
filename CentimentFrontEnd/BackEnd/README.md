# Centiment Backend

A Node.js/Express backend for the Centiment Expense Analysis and Prediction Web App.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd CentimentFrontEnd/BackEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   nano .env
   ```

4. **MongoDB Connection**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Update the `MONGO_URI` in your `.env` file

### Environment Variables

Create a `.env` file in the BackEnd directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
```

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```

2. **Production mode**
   ```bash
   npm start
   ```

## 📊 Database Setup

### Test User with Sample Data

To create a test user with sample data, run:

```bash
node setupDatabase.js
```

This will create:
- A test user with credentials: `test@example.com` / `password123`
- Sample expenses across different categories
- Sample income from various sources

### Manual Database Setup

If you want to set up the database manually:

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Register a new user** via the API endpoint:
   ```
   POST /api/v1/auth/register
   ```

3. **Add expenses and income** via the respective endpoints

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile

### Expenses
- `GET /api/v1/expense` - Get all expenses
- `POST /api/v1/expense` - Add new expense
- `PUT /api/v1/expense/:id` - Update expense
- `DELETE /api/v1/expense/:id` - Delete expense

### Income
- `GET /api/v1/income` - Get all income
- `POST /api/v1/income` - Add new income
- `PUT /api/v1/income/:id` - Update income
- `DELETE /api/v1/income/:id` - Delete income

### Dashboard
- `GET /api/v1/dashboard/overview` - Get dashboard overview
- `GET /api/v1/dashboard/recent` - Get recent transactions

### Predictions
- `POST /api/v1/predictions/expense` - Predict future expenses

## 🗄️ Database Models

### User
- `fullName` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `profilepic` - Profile picture URL

### Expense
- `userId` - Reference to User
- `category` - Expense category
- `amount` - Expense amount
- `icon` - Category icon
- `date` - Transaction date

### Income
- `userId` - Reference to User
- `source` - Income source
- `amount` - Income amount
- `icon` - Source icon
- `date` - Transaction date

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- File upload security

## 📁 Project Structure

```
BackEnd/
├── Config/
│   └── db.js              # Database configuration
├── Controller/
│   ├── authController.js   # Authentication logic
│   ├── expenseController.js # Expense management
│   ├── incomeController.js  # Income management
│   └── ...
├── Middleware/
│   ├── authmiddleware.js   # JWT authentication
│   └── uploadimgmiddleware.js # File upload handling
├── Models/
│   ├── User.js            # User model
│   ├── Expense.js         # Expense model
│   └── Income.js          # Income model
├── Routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── expenseRoutes.js   # Expense routes
│   └── ...
├── Uploads/               # File upload directory
├── .env                   # Environment variables
├── .env.example          # Environment template
├── index.js              # Server entry point
└── package.json          # Dependencies
```

## 🛠️ Development

### Adding New Features

1. Create model in `Models/` directory
2. Create controller in `Controller/` directory
3. Create routes in `Routes/` directory
4. Add route to `index.js`

### Testing

```bash
# Test database connection
node testConnection.js

# Setup sample data
node setupDatabase.js
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure network access is enabled in MongoDB Atlas
   - Verify username and password

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

3. **JWT Token Issues**
   - Check JWT_SECRET in .env
   - Ensure token is being sent in Authorization header

## 📝 License

This project is part of the Centiment Expense Analysis application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
