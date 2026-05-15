import express from "express";
import path, {dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todosRoutes from "./routes/appRoutes.js";
import { authenticate } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

//in ES modules, __dirname and __filename are not available but it is available in commonjs
//so we use the following
//import.meta.url is a special property that returns the current file's URL
const __filename = fileURLToPath(import.meta.url); // get current absolute file path i.e server.js
const __dirname = dirname(__filename); // get current absolute directory path i.e src

//to serve static files use middleware
app.use(express.static(path.join(__dirname, "../public"))); //express.static() to find and serve static files
app.use(express.json()); //express.json() to parse json data

//console.log(__dirname)
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public", "index.html") //join connects the path with /
    );
});
//routes
app.use("/auth", authRoutes); //any routes defined in authRoutes will be prefixed with /auth
app.use("/todos", authenticate, todosRoutes); //any routes defined in todosRoutes will be prefixed with /todos
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));