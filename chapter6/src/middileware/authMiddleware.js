import jwt from "jsonwebtoken"
import { prisma } from "../prismaClient.js"
export const authorise = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const parts = req.headers.authorization.split(" ")
        token = parts[1] ? parts[1].replace(/^"|"$/g, '') : null
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt.replace(/^"|"$/g, '')
    }
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (error) {
        console.error("JWT Verification Error:", error.message)
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}