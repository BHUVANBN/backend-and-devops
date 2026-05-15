import jwt from "jsonwebtoken";
import db from "../db.js";
//purpose of the middle ware is t intercept the request and read and verify the token
//It checks:
//Is the token structure valid?
//Is the signature correct using your secret?
//Is it expired?

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user; //add user to request object, useer is already in the token
        next();
    });
};