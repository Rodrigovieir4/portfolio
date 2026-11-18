import { expect, test } from "bun:test"

import { app } from "./index"

test("GET /health responde ok", async () => {
  const res = await app.handle(new Request("http://localhost/health"))

  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})
