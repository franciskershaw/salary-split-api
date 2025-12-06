// Passport
export const GOOGLE_PROVIDER = "google";
export const LOCAL_PROVIDER = "local";

// Cookie
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: "strict" as const,
} as const;

// Account Types
export const ACCOUNT_TYPES = {
  CURRENT: "current",
  SAVINGS: "savings",
  INVESTMENT: "investment",
  JOINT: "joint",
} as const;
export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];

// Bill Types
export const BILL_TYPES = {
  HOUSING: "housing",
  UTILITIES: "utilities",
  COMMUNICATION: "communication",
  ENTERTAINMENT: "entertainment",
  INSURANCE: "insurance",
  TRANSPORT: "transport",
  FINANCIAL: "financial",
  HEALTHCARE: "healthcare",
  BUSINESS: "business",
  EDUCATION: "education",
  FOOD: "food",
  PERSONAL: "personal",
  GIFT: "gift",
  HOLIDAYs: "holidays",
  OTHER: "other",
} as const;
export type BillType = (typeof BILL_TYPES)[keyof typeof BILL_TYPES];

export const CURRENCIES = {
  GBP: "GBP",
  USD: "USD",
  EUR: "EUR",
} as const;
export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export const CATEGORY_APPLICABLE_FEATURES = [
  "transactions",
  "bills",
  "expenses",
  "savings",
] as const;
export type CategoryApplicableFeature =
  (typeof CATEGORY_APPLICABLE_FEATURES)[number];

// Feature Models for Amount Updates
export const FEATURE_CONFIG = {
  accounts: {
    singular: "account",
    responseKey: "updatedAccount",
  },
  bills: {
    singular: "bill",
    responseKey: "updatedBill",
  },
  expenses: {
    singular: "expense",
    responseKey: "updatedExpense",
  },
  savings: {
    singular: "saving",
    responseKey: "updatedSaving",
  },
} as const;

export type FeatureType = keyof typeof FEATURE_CONFIG;
