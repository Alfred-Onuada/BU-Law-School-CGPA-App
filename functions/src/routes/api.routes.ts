import { Router } from "express";
import { createSession, getSemesters, getSessions, getSession, createSemester, getLevels, getSemesterAndSessionDetails, createLevel, getSemester } from "../controllers/api.controller.js";
const router = Router();

router.get('/sessions', getSessions);

router.get('/session/:sessionId', getSession);

router.post('/sessions', createSession);

router.get('/sessions/:sessionId/semesters', getSemesters);

router.post('/sessions/:sessionId/semesters', createSemester);

router.get('/levels', getLevels);

router.post('/levels', createLevel);

router.get('/semestersAndSession/:semesterId', getSemesterAndSessionDetails);

router.get('/semester/:semesterId', getSemester);

export default router;