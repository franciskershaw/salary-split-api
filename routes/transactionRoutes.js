const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getTransactions,
} = require('../controllers/transactionController');

const { isLoggedIn, isAuthorised } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(isLoggedIn, asyncHandler(getTransactions))
  .post(isLoggedIn, asyncHandler(addTransaction));

router
  .route('/:transactionId')
  .put(isLoggedIn, isAuthorised, asyncHandler(editTransaction))
  .delete(isLoggedIn, isAuthorised, asyncHandler(deleteTransaction));

module.exports = router;
