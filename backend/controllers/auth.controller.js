import { validate } from "email-validator" 
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"

export const signup = async (req, res) => {
    try {

        const { username, fullName, email, password } = req.body

        if(!username || !fullName || !email || !password){
            return res.status(400).json({ error: "All fields are required" })
        }

        // Check if email format is valid
        if(validate(email) === false) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        // Check if username already exists
        let user = await User.findOne({ username })

        if(user){
            return res.status(400).json({ error: "Username is already taken" })
        }

        // Check if email already exists
        user = await User.findOne({ email })

        if(user){
            return res.status(400).json({ error: "Email is already taken" })
        }

        // Check if password length is less than 6
        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters long" })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        user = await User.create({
            username,
            fullName,
            email,
            password: hashedPassword
        })

        if(!user){
            return res.status(500).json({ error: "Something went wrong while creating user" })
        }

        generateTokenAndSetCookie(user._id, res)

        user = await User.findById(user._id).select("-password")

        res
        .status(201)
        .json({ data: user, success: "User created successfully" })
        
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ error: "Signup failed" })
    }
}

export const login = async (req, res) => {
    res.json({ message: "Login route" })
}

export const logout = async (req, res) => {
    res.json({ message: "Logout route" })
}