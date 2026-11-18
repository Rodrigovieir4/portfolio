import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"

const origin = process.env.WEB_URL ?? "http://localhost:3000"

export const app = new Elysia()
  .use(cors({ origin }))
  .get("/health", () => ({ ok: true }))

export type App = typeof app
