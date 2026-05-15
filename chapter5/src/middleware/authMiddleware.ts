import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("Unauthorized");
    }
    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send("JWT_SECRET is not defined");
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user; // add user to request object
        next();
    });
};
