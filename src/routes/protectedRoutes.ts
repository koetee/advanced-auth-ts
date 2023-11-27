import express from "express";
import { protectedRoute } from "../controllers/protectedController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticateToken);

router.get("/protected", protectedRoute);

export default router;
