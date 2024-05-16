import { Router } from "express";
import { createSession, getSemesters, getSessions, createSemester, getLevels, getSemesterAndSessionDetails, createLevel } from "../controllers/api.controller.js";
const router = Router();

router.get('/sessions', getSessions);

router.post('/sessions', createSession);

router.get('/sessions/:sessionId/semesters', getSemesters);

router.post('/sessions/:sessionId/semesters', createSemester);

router.get('/levels', getLevels);

router.post('/levels', createLevel);

router.get('/semestersAndSession/:semesterId', getSemesterAndSessionDetails);

export default router;