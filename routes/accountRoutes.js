const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  getAccounts,
  addAccount,
  editAccount,
  deleteAccount,
} = require('../controllers/accountController');

const { isLoggedIn, isAuthorised } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(isLoggedIn, asyncHandler(getAccounts))
  .post(isLoggedIn, asyncHandler(addAccount));

router
  .route('/:accountId')
  .put(isLoggedIn, isAuthorised, asyncHandler(editAccount))
  .delete(isLoggedIn, isAuthorised, asyncHandler(deleteAccount));

module.exports = router;
