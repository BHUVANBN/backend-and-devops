import express from "express";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.ts";
import todosRoutes from "./routes/appRoutes.ts";
import { authenticate } from "./middleware/authMiddleware.ts";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/", (req: ExpressRequest, res: ExpressResponse) => {
    res.sendFile(
        path.join(__dirname, "../public", "index.html")
    );
});

// routes
app.use("/auth", authRoutes);
app.use("/todos", authenticate as any, todosRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
