import { Router } from "express";
import authRoutes from "./auth.routes.js";
import competitionRoutes from "./competition.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use("/auth", authMiddleware, authRoutes);
router.use("competitions", authMiddleware, competitionRoutes);

export default router;