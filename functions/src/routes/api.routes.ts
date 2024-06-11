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
  getCourses,
  saveCourses,
  deleteCourse,
  getStudent,
  getStudentGrades,
  saveGrades,
  getAllStudents,
  login,
} from '../controllers/api.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';
const router = Router();

router.post('/auth/login', login);

router.use(isLoggedIn);

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

router.get('/student/:studentId', getStudent);

router.get('/courses', getCourses);

router.post('/courses', saveCourses);

router.delete('/course/:courseId', deleteCourse);

router.get('/grades', getStudentGrades);

router.post('/grades', saveGrades);

router.get('/all-students', getAllStudents);

export default router;
