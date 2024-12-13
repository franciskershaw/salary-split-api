const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  createUser,
  loginUser,
  checkRefreshToken,
  logoutUser,
  getUserInfo,
  editUser,
} = require('../controllers/userController');

const { isLoggedIn } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(asyncHandler(createUser))
  .put(isLoggedIn, asyncHandler(editUser))
  .get(isLoggedIn, asyncHandler(getUserInfo));

router.route('/login').post(asyncHandler(loginUser));

router.route('/refreshToken').get(checkRefreshToken);

router.route('/logout').post(logoutUser);

module.exports = router;
