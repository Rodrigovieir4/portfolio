import { app } from "./index"

const port = Number(process.env.PORT ?? 3001)

app.listen(port)
console.warn(`api on ${port}`)
