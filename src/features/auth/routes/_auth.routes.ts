import express from "express";
import passport from "passport";
import authController from "../contollers/_auth.controller";
import { refreshTokens } from "../middleware/auth.middleware";
import { GOOGLE_PROVIDER } from "../../../core/utils/constants";

const router = express.Router();

// Local login route
router.post("/login", authController.localLogin);
router.post("/register", authController.localRegister);

// Google OAuth route
router.get(
  "/google",
  passport.authenticate(GOOGLE_PROVIDER, { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate(GOOGLE_PROVIDER, {
    session: false,
    failureRedirect: process.env.CORS_ORIGIN,
  }),
  authController.googleCallback
);

// Logout route
router.post("/logout", authController.logout);

// Refresh token route
router.get("/refresh-token", refreshTokens);

export default router;
