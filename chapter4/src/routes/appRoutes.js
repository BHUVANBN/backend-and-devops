import express from "express";
import prisma from "../prismaClient.js";
const router = express.Router();

//GET /app/todos
router.get("/", async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.user.userId
        }
    });
    res.json(todos);
});
router.post("/", async (req, res) => {
    const { task } = req.body;
    const result = await prisma.todo.create({
        data: {
            userId: req.user.userId,
            task
        }
    });
    res.json({ id: result.id, task });
});
router.put("/:id", async (req, res) => {  //:id is a dynamic parameter
    const { id } = req.params; //get id from request params url
    const { completed } = req.body;
    const result = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.user.userId
        },
        data: {
            completed: !completed
        }
    });
    res.json({ id, completed: !completed });
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId: req.user.userId
        }
    });
    res.json({ id });
});
export default router;