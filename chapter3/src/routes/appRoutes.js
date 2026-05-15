import express from "express";
import db from "../db.js";

const router = express.Router();

//GET /app/todos
router.get("/", (req, res) => {
    const todos = db.prepare("SELECT * FROM todos WHERE user_id = ?").all(req.user.userId);
    res.json(todos);
});
router.post("/", (req, res) => {
    const { task } = req.body;
    const result = db.prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)").run(req.user.userId, task);
    res.json({ id: result.lastInsertRowid, task });
});
router.put("/:id", (req, res) => {  //:id is a dynamic parameter
    const { id } = req.params; //get id from request params url
    const { completed } = req.body;
    const result = db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(completed, id);
    res.json({ id, completed });
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const result = db.prepare("DELETE FROM todos WHERE id = ? AND user_id = ?").run(id, req.user.userId);
    res.json({ id });
});
export default router;