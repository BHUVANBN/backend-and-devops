import express from "express";
import bcrypt from "bcryptjs";  //to encrypt the password
import jwt from "jsonwebtoken"; //for generating tokens
import prisma from "../prismaClient.js";

const router = express.Router(); //now router is used to define routes instead pf app in server.js

//POST /auth/register
router.post("/register", async (req, res) => {
    const { name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try{
        //prepare() used to inject the sql query with values
        const user = await prisma.user.create({ //user is the model 
            data: {
                name,
                password: hashedPassword
            }
        });
        //now we have a user in the database let them add a todo
        const defaultTodo = "Default Todo";
        await prisma.todo.create({
            data:{
                task: defaultTodo,
                userId: user.id
            }
        })
        //create a token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}); 
router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try{
        const getUser = await prisma.user.findUnique({
            where: {
                name : name
            }
        });
        const user = getUser; //get() returns the first row that matches the query, use all() for all rows
        if (!user) {
            return res.status(401).send("user not found");
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

export default router;
