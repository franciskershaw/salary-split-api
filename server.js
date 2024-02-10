const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');

// Grab port info from config
const PORT = process.env.PORT || 5300;

// Initialize app
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Salary Split API' });
});

// Connect to DB, then if successful listen for app
connectDB()
  .then(() => {
    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
          .yellow,
        '-----------------------------------------------------------'.yellow
      )
    );
  })
  .catch((err) => {
    console.error(
      `Error connecting to MongoDB: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  });
