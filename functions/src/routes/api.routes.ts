import { Router } from "express";
import { createSession, getSessions } from "../controllers/api.controller.js";
const router = Router();

router.get('/sessions', getSessions);

router.post('/sessions', createSession);

export default router;