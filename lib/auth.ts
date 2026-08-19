import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { client, db } from "./auth-db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret:
    process.env.AUTH_SECRET!,

  baseURL:
    process.env.AUTH_URL ||
    "https://mosfet.mn",

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },

      company: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },

      avatar: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },

      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
        returned: true,
      },
    },
  },

  plugins: [
    nextCookies(),
  ],
});