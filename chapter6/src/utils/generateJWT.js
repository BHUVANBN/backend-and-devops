import jwt from "jsonwebtoken"

export const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Changed for development
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
    })
    return token
}
//jwt(payloadObj,secretKey,expiresIn)