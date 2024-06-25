import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())    // to parse json data
app.use(express.urlencoded({ extended: true }))    // to parse form data(urlencoded)
app.use(cookieParser())   // to parse cookies


// routes import
import authRoutes from "./routes/auth.routes.js"


// routes declaration
app.use("/api/v1/auth", authRoutes)


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((error) => {
    console.log("Server connection failed: ", error);
    process.exit(1)
})