import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" })

    // Set cookie
    res.cookie("token", token, { 
        maxAge: 10 * 24 * 60 * 60 * 1000,  // expires in 10 days
        httpOnly: true,  // cookie cannot be accessed by client-side JavaScript
        sameSite: "strict",  // cookie is not sent with cross-origin requests
        secure: process.env.NODE_ENV === "production"  // cookie is only sent over HTTPS in production
    });
}

export default generateTokenAndSetCookie
