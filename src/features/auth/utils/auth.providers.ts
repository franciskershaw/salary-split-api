// Lazy load arctic since it's ES Module only and we're using CommonJS
let googleProvider: any = null;

export const getGoogleProvider = async () => {
  if (!googleProvider) {
    const { Google } = await import("arctic");
    googleProvider = new Google(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );
  }
  return googleProvider;
};

// Export helper functions that also need dynamic import
export const getArcticHelpers = async () => {
  const { generateState, generateCodeVerifier } = await import("arctic");
  return { generateState, generateCodeVerifier };
};
