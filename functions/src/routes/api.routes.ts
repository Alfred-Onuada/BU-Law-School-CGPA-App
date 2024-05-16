import { Router } from "express";
import { createSession, getSemeseters, getSessions, createSemester } from "../controllers/api.controller.js";
const router = Router();

router.get('/sessions', getSessions);

router.post('/sessions', createSession);

router.get('/sessions/:sessionId/semesters', getSemeseters);

router.post('/sessions/:sessionId/semesters', createSemester);

export default router;