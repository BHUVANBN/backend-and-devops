import { Router } from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";
import { authorise } from "../middileware/authMiddleware.js";

const router = Router();


router.post("/",authorise, addToWatchlist);

export default router;
