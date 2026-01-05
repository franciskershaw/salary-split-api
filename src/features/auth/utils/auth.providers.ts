// Lazy load arctic since it's ES Module only and we're using CommonJS
let googleProvider: any = null;

export const getGoogleProvider = async () => {
  if (!googleProvider) {
    try {
      const { Google } = await import("arctic");

      // Validate environment variables
      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is not set");
      }
      if (!process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error("GOOGLE_CLIENT_SECRET is not set");
      }
      if (!process.env.GOOGLE_REDIRECT_URI) {
        throw new Error("GOOGLE_REDIRECT_URI is not set");
      }

      googleProvider = new Google(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
    } catch (error) {
      console.error("Failed to initialize Google provider:", error);
      throw error;
    }
  }
  return googleProvider;
};

// Export helper functions that also need dynamic import
export const getArcticHelpers = async () => {
  const { generateState, generateCodeVerifier } = await import("arctic");
  return { generateState, generateCodeVerifier };
};
