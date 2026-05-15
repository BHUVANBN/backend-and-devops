import "dotenv/config"
import express from 'express'
import router from './routes/authRoutes.js'
import watchlistRouter from './routes/watchlistRoutes.js'
import cookieParser from "cookie-parser"
import { connectDB, disconnectDB } from './prismaClient.js'
await connectDB()
// ----------- 1️⃣ Handle Unhandled Promise Rejections -----------
process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled Rejection:", reason)
  await disconnectDB()
  process.exit(1)
})
// ----------- 2️⃣ Handle Uncaught Exceptions -----------
process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error)
  await disconnectDB()
  process.exit(1)
})
// ----------- 3️⃣ Handle Graceful Shutdown (SIGINT / SIGTERM) -----------
async function gracefulShutdown() {
  console.log("Shutting down...")
  await disconnectDB()
  process.exit(0)
}
process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)


const app = express()
const port = process.env.PORT || 3001

app.use(express.json()) // body parsing middlewares
app.use(cookieParser())

app.get("/", (req, res) => {
  res.status(202).send(`<h1>this is the home page</h1>`)
})

app.use("/auth", router)
app.use("/watchlist", watchlistRouter)
app.listen(port, () => {
  console.log(`server is running on http://localhost:3000`)
})