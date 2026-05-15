import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.ts";

const router = express.Router();

// POST /auth/register
router.post("/register", (req: Request, res: Response) => {
    const { name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const insertUser = (db as any).prepare("INSERT INTO users (name, password) VALUES (?, ?)");
        const result = insertUser.run(name, hashedPassword);

        const defaultTodo = (db as any).prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)");
        defaultTodo.run(result.lastInsertRowid, "Default Todo");

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).send("JWT_SECRET is not defined");
        }

        const token = jwt.sign({ userId: result.lastInsertRowid }, secret, { expiresIn: "1h" });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post("/login", (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const getUser = (db as any).prepare("SELECT * FROM users WHERE name = ?");
        const user = getUser.get(name);
        if (!user) {
            return res.status(401).send("user not found");
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).send("JWT_SECRET is not defined");
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

export default router;
