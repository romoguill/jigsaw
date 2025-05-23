import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

console.log(import.meta.env.VITE_SERVER_URL);

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["admin", "user", "guest"] as const,
        },
      },
    }),
    anonymousClient(),
  ],
});
