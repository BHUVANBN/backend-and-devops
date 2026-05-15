import { prisma } from "../prismaClient.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateJWT.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" })
    }
    const userExists = await prisma.user.findUnique({
        where: { email },
    })
    if (userExists) {
        return res.status(400).json({ error: "user already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    const token = generateToken(user.id,res)
    res.status(201).json({
        status: "success",
        token,  
        message: `user created ${user.name}`
    })
}

export const login = async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({error:"All fields required"})
    }
    const user = await prisma.user.findUnique({
        where:{email},
    })
    if(!user){
        return res.status(400).json({error:"user not found"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({error:"invalid password"})
    }
    const token = generateToken(user.id,res)
    res.status(200).json({
        status:"success",
        token,
        message:`user logged in ${user.name}`
    })
}

export const logout = async (req,res)=>{
    res.cookie("jwt", "", { //remove the cookie
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "strict",
        maxAge: 0  //set the maxAge to 0 to remove the cookie
    })
    res.status(200).json({ message: "Logged out successfully" })
}
