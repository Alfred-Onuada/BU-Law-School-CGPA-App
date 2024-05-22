import { Router } from 'express';
import {
  createSession,
  getSemesters,
  getSessions,
  getSession,
  createSemester,
  getLevels,
  getSemesterAndSessionDetails,
  createLevel,
  getSemester,
  createStudent,
  createStudentsBulk,
  getStudents,
} from '../controllers/api.controller';
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

router.post('/student', createStudent);

router.post('/student/bulk', createStudentsBulk);

router.get('/students', getStudents);

export default router;
