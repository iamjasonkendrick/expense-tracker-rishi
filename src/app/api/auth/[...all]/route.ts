import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

// This tells Next.js: "Let Better Auth handle all auth requests"
export const { GET, POST } = toNextJsHandler(auth);
