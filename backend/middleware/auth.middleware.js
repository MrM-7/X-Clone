import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")  // get token from cookies or header

        if(!token){
            return res.status(401).json({ error: "Unauthorized: No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // verify token

        if(!decoded){
            return res.status(401).json({ error: "Unauthorized: Invalid token" })
        }

        const user = await User.findById(decoded.userId).select("-password")  // get user from database

        if(!user){
            return res.status(404).json({ error: "User not found" })
        }

        req.user = user  // set user in request object
        next()

    } catch (error) {
        console.log("Error in verifyToken middleware: ", error.message);
        res.status(500).json({ error: "Token verification failed" })
    }
}