import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongodb, mongoClient } from "./database";

export const auth = betterAuth({
  database: mongodbAdapter(mongodb, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 30,
    updateAge: 60 * 5,
  },
});
