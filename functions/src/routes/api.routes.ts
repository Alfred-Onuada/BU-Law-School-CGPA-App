import { Router } from "express";
import { getSessions } from "../controllers/api.controller.js";
const router = Router();

router.get('/sessions', getSessions);

export default router;