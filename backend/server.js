import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000


// routes import
import authRoutes from "./routes/auth.routes.js"


// routes declaration
app.use("/api/v1/auth", authRoutes)


app.listen(PORT, () => {
    console.log(`⚙️  Server is running at port : ${PORT}`);
})