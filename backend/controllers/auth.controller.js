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
    try {
        
        const { username, password } = req.body

        if(!username || !password){
            return res.status(400).json({ error: "All fields are required" })
        }

        let user = await User.findOne({ username })

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.status(400).json({ error: "Invalid credentials" })
        }

        generateTokenAndSetCookie(user._id, res)

        user = await User.findById(user._id).select("-password")

        res
        .status(200)
        .json({ data: user, success: "Login successful" })

    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ error: "Login failed" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0, httpOnly: true })

        res.status(200).json({ success: "Logout successful" })

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Logout failed" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req?.user._id).select("-password")

        if(!user){
            return res.status(500).json({ error: "User not found" })
        }

        res.status(200).json({ data: user, success: "User found" })
    } catch (error) {
        console.log("Error in getMe controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}