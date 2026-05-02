import express from "express";
import { getMovies, createMovie, updateMovie, deleteMovie } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getMovies);

router.post("/", createMovie);

router.put("/", updateMovie);

router.delete("/", deleteMovie);

export default router;
