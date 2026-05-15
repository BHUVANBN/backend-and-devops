import express from "express";
import type { Response } from "express";
import db from "../db.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";

const router = express.Router();

// GET /app/todos
router.get("/", (req: AuthRequest, res: Response) => {
    const todos = (db as any).prepare("SELECT * FROM todos WHERE user_id = ?").all(req.user.userId);
    res.json(todos);
});

router.post("/", (req: AuthRequest, res: Response) => {
    const { task } = req.body;
    const result = (db as any).prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)").run(req.user.userId, task);
    res.json({ id: result.lastInsertRowid, task });
});

router.put("/:id", (req: AuthRequest, res: Response) => {  // :id is a dynamic parameter
    const { id } = req.params; // get id from request params url
    const { completed } = req.body;
    (db as any).prepare("UPDATE todos SET completed = ? WHERE id = ?").run(completed, id);
    res.json({ id, completed });
});

router.delete("/:id", (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    (db as any).prepare("DELETE FROM todos WHERE id = ? AND user_id = ?").run(id, req.user.userId);
    res.json({ id });
});

export default router;
