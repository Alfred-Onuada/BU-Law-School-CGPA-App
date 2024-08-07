import { Request, Response } from 'express';
import SESSION from '../models/session.model';
import SEMESTER from '../models/semester.model';
import LEVEL from '../models/level.model';
import STUDENT from '../models/student.model';
import { Op } from 'sequelize';
import sequelize from 'sequelize/lib/sequelize';
import COURSE from '../models/course.model';
import GRADE, { recalculateGradePoint } from '../models/grade.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function getSessions(_: Request, res: Response) {
  try {
    const sessions = await SESSION.findAll({ order: [['startYear', 'DESC']] });

    res.status(200).json({ message: 'Success', data: sessions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSession(req: Request, res: Response) {
  try {
    const { name, startYear } = req.body;
    const session = await SESSION.create({ name, startYear });

    res.status(201).json({ message: 'Success', data: session });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    
    res.status(500).json({ message: error.message });
  }
}

export async function getSemesters(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const semesters = await SEMESTER.findAll({ where: { sessionId }, order: [['createdAt', 'DESC']]});

    res.status(200).json({ message: 'Success', data: { semesters, session } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSemester(req: Request, res: Response) {
  try {
    const { name, optional } = req.body;
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const semester = await SEMESTER.create({ name, sessionId, optional });

    res.status(201).json({ message: 'Success', data: semester });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getLevels(_: Request, res: Response) {
  try {
    const levels = await LEVEL.findAll({ order: [['name', 'ASC']] });

    res.status(200).json({ message: 'Success', data: levels });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSemesterAndSessionDetails(
  req: Request,
  res: Response
) {
  try {
    const { semesterId } = req.params;
    const semester = await SEMESTER.findByPk(semesterId);

    if (!semester) {
      res.status(404).json({ message: 'Semester not found' });
      return;
    }

    const session = await SESSION.findByPk(semester.toJSON().sessionId);

    res.status(200).json({ message: 'Success', data: { semester, session } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createLevel(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const level = await LEVEL.create({ name });

    res.status(201).json({ message: 'Success', data: level });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSemester(req: Request, res: Response) {
  try {
    const { semesterId } = req.params;
    const semester = await SEMESTER.findByPk(semesterId);

    if (!semester) {
      res.status(404).json({ message: 'Semester not found' });
      return;
    }

    res.status(200).json({ message: 'Success', data: semester });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.status(200).json({ message: 'Success', data: session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const studentInfo = req.body;

    if (
      typeof studentInfo !== 'object' ||
      Object.keys(studentInfo).length === 0
    ) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    await STUDENT.create(studentInfo);

    res.status(201).json({ message: 'Success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStudentsBulk(req: Request, res: Response) {
  try {
    const studentsInfo = req.body;

    if (!Array.isArray(studentsInfo) || studentsInfo.length === 0) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    await STUDENT.bulkCreate(studentsInfo);

    res.status(201).json({ message: 'Success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// this serves as search for the level by level students list
export async function getStudents(req: Request, res: Response) {
  try {
    const { sessionId, level, semesterId } = req.query;

    if (!sessionId || !level || !semesterId) {
      res.status(400).json({ message: 'Invalid query' });
      return;
    }

    // get session info
    const session = await SESSION.findByPk(sessionId as string);

    // check start year
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    const sessionStartYear = session.toJSON().startYear;

    // Ensure the level is an integer
    const requestedLevel = parseInt(level as string);
    if (isNaN(requestedLevel)) {
      res.status(400).json({ message: 'Invalid level query parameter' });
      return;
    }

    let limit = 10;
    if (typeof req.query.limit === 'string') {
      if (parseInt(req.query.limit) > 0) {
        limit = parseInt(req.query.limit);
      } else if (parseInt(req.query.limit) === -1) {
        limit = 100_000_000; // there will never be 100 million students in a school :)
      }
    }

    // get current page
    let page = 1;
    let skip = 0;
    if (
      typeof req.query.page === 'string' &&
      parseInt(req.query.page as string) >= 1
    ) {
      page = parseInt(req.query.page as string);
      skip = (page - 1) * limit;
    }

    // check for search query
    let query = '';
    let queryClause = {};
    if (
      typeof req.query.query === 'string' &&
      req.query.query.trim().length >= 2
    ) {
      query = req.query.query;
      queryClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { matricNo: { [Op.like]: `%${query}%` } },
        ],
      };
    }

    // Calculate the year difference to determine current level
    const currentLevelClause = {
      [Op.and]: [
        sequelize.where(
          sequelize.fn(
            'FLOOR',
            sequelize.literal(
              '(' +
                sessionStartYear +
                ' - `yearEnrolled`) + (`levelAtEnrollment` / 100)'
            )
          ),
          requestedLevel / 100
        ),
      ],
    };

    // Merge query clauses
    queryClause = {
      ...queryClause,
      ...currentLevelClause,
      yearEnrolled: {
        [Op.lte]: sessionStartYear,
      },
    };

    const result = await STUDENT.findAndCountAll({
      where: queryClause,
      order: [['lastName', 'ASC']],
      limit,
      offset: skip,
    });

    // Calculate CGPA and semesterGPA for each student
    const studentsWithGPA = await Promise.all(result.rows.map(async (student) => {
      const studentData = student.toJSON();

      // GPA use just the courses I have grades for
      const grades = await GRADE.findAll({
        where: {
          studentId: studentData.id,
          semesterId,
          studentLevel: level,
        },
        include: [{
          model: COURSE,
          as: 'course',
          required: true,
        }]
      });

      const totalGradePointsGained = grades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
      const totalUnitsSemester = grades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

      const semesterGPA = totalUnitsSemester > 0
        ? totalGradePointsGained / totalUnitsSemester
        : 0;

      // calculate CGPA - use all the person's assigned grades
      const allGrades = await GRADE.findAll({
        where: {
          studentId: studentData.id,
        },
        include: [{
          model: COURSE,
          as: 'course',
          required: true,
        }]
      })

      const totalGradePointsGainedForAllCourses = allGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
      const totalUnits = allGrades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

      const CGPA = totalUnits > 0
        ? totalGradePointsGainedForAllCourses / totalUnits
        : 0;

      return { ...studentData, semesterGPA: parseFloat(semesterGPA.toFixed(2)), CGPA: parseFloat(CGPA.toFixed(2)) };
    }));

    res
      .status(200)
      .json({
        message: 'Success',
        data: { students: studentsWithGPA, total: result.count },
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    const { sessionId, semesterId, level } = req.query;

    if (!sessionId || !semesterId || !level) {
      res.status(400).json({ message: 'Invalid query' });
      return;
    }

    const courses = await COURSE.findAll({
      where: { sessionId, semesterId, level },
      order: [['name', 'ASC']],
    });

    res.status(200).json({ message: 'Success', data: courses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function saveCourses(req: Request, res: Response) {
  try {
    const courses = req.body;

    if (!Array.isArray(courses) || courses.length === 0) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    // remove the id field from any course without an id
    courses.forEach((course) => {
      if (!course.id) {
        delete course.id;
      }
    });

    // update grades for all the courses
    courses.forEach(async (course) => {
      if (course.id) await recalculateGradePoint(course.id, course.units);
    });

    // this is how upsert works in sequelize, the fields array is used to specify the fields to update
    // the updateOnDuplicate option is used to specify the fields to update when the primary key already exists
    await COURSE.bulkCreate(courses, { updateOnDuplicate: ['name', 'units', 'code'] });

    res.status(201).json({ message: 'Success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      res.status(400).json({ message: 'Invalid query' });
      return;
    }

    const course = await COURSE.findByPk(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    await course.destroy();

    res.status(200).json({ message: 'Success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStudent(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const student = await STUDENT.findByPk(studentId);

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json({ message: 'Success', data: student });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStudentGrades(req: Request, res: Response) {
  try {
    const { sessionId, semesterId, level, studentId } = req.query;

    if (!sessionId || !semesterId || !level || !studentId) {
      res.status(400).json({ message: 'Invalid query' });
      return;
    }

    // the idea here is to get all the courses for the semester and session and level first
    // then for each course, get the student's grade if it exists, if it doesn't exist assign -1
    // Fetch all courses for the given semester, session, and level
    let courses = await COURSE.findAll({
      where: {
        semesterId,
        sessionId,
        level,
      },
    });

    if (courses.length === 0) {
      res
        .status(404)
        .json({ message: 'No courses found for the given parameters' });
      return;
    }

    // For each course, fetch the student's grade if it exists
    const studentGrades = await Promise.all(
      courses.map(async (course) => {
        const grade = await GRADE.findOne({
          where: {
            courseId: course.get('id'),
            studentId,
            semesterId,
            sessionId,
            studentLevel: level,
          },
        });

        return {
          courseId: course.get('id'),
          code: course.get('code'),
          name: course.get('name'),
          units: course.get('units'),
          grade: grade ? grade.get('grade') : 'NG',
          score: grade ? grade.get('score') : 'N/A',
        };
      })
    );

    res.status(200).json({ message: 'Success', data: studentGrades });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function saveGrades(req: Request, res: Response) {
  try {
    const { score, studentId, courseId, studentLevel, semesterId, sessionId } = req.body;

    if (!score || !studentId || !courseId || !studentLevel || !semesterId || !sessionId) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    // check if the student exists
    const student = await STUDENT.findByPk(studentId);

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    // check if the course exists
    const course = await COURSE.findByPk(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // check semester
    const semester = await SEMESTER.findByPk(semesterId);

    if (!semester) {
      res.status(404).json({ message: 'Semester not found' });
      return;
    }

    // check session
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // check if the grade already exists
    const grade = await GRADE.findOne({
      where: {
        studentId,
        courseId,
        studentLevel,
        semesterId,
        sessionId,
      },
    });

    // grading system 100-80 - A, 60-79 - B, 50-59 - C, 45-49 - D, 40-44 - E, 39-0 - F
    const gradeLetter = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 50 ? 'C' : score >= 45 ? 'D' : score >= 40 ? 'E' : 'F';
    const gradePoint = course.toJSON().units * (gradeLetter === 'A' ? 5 : gradeLetter === 'B' ? 4 : gradeLetter === 'C' ? 3 : gradeLetter === 'D' ? 2 : gradeLetter === 'E' ? 1 : 0);

    if (grade) {      
      await grade.update({ score, grade: gradeLetter, gradePoint});
    } else {
      await GRADE.create({
        score,
        studentId,
        courseId,
        studentLevel,
        semesterId,
        sessionId,
        grade: gradeLetter,
        gradePoint
      });
    }

    res.status(201).json({ message: 'Success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllStudents(req: Request, res: Response) {
  try {
    let limit = 10;
    if (typeof req.query.limit === 'string') {
      if (parseInt(req.query.limit) > 0) {
        limit = parseInt(req.query.limit);
      } else if (parseInt(req.query.limit) === -1) {
        limit = 100_000_000; // there will never be 100 million students in a school :)
      }
    }

    // get current page
    let page = 1;
    let skip = 0;
    if (
      typeof req.query.page === 'string' &&
      parseInt(req.query.page as string) >= 1
    ) {
      page = parseInt(req.query.page as string);
      skip = (page - 1) * limit;
    }

    // check for search query
    let query = '';
    let queryClause = {};
    if (
      typeof req.query.query === 'string' &&
      req.query.query.trim().length >= 2
    ) {
      query = req.query.query;
      queryClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { matricNo: { [Op.like]: `%${query}%` } },
        ],
      };
    }    

    const result = await STUDENT.findAndCountAll({
      where: queryClause,
      order: [['lastName', 'ASC']],
      limit,
      offset: skip,
      attributes: ['id', 'firstName', 'lastName', 'matricNo', 'levelAtEnrollment', 'yearEnrolled']
    });

    const studentsWithCGPA = await Promise.all(result.rows.map(async (student) => {
      const studentData = student.toJSON();

      const currentYear = new Date().getFullYear();
      const yearsSinceEnrollment = currentYear - studentData.yearEnrolled;

      const levels = [100, 200, 300, 400, 500, 600]
        .filter(lvl => lvl >= (student.get('levelAtEnrollment') as number))
        .filter(lvl => lvl <= yearsSinceEnrollment * 100);

      const allGPAs: any = {};

      // so now for each level I need the GPA for the first and second semesters
      for (const lvl of levels) {
        // figure out what session the student was in this level, then use that session Id to find the 'first semester' and 'second semester' for that session
        // then continue with the calculation

        // get the session id for this level (start from when the student enrolled)
        let currentYear = studentData.yearEnrolled;
        let currentLevel = studentData.levelAtEnrollment;

        if (currentLevel > lvl) {
          continue;
        }

        while (currentLevel < lvl) {
          currentYear++;
          currentLevel += 100;
        }

        const session = await SESSION.findOne({
          where: {
            startYear: currentYear,
          }
        });


        if (!session) {
          continue;
        }

        const firstSemester = await SEMESTER.findOne({
          where: {
            sessionId: session.get('id'),
            name: 'First Semester',
          }
        });

        const secondSemester = await SEMESTER.findOne({
          where: {
            sessionId: session.get('id'),
            name: 'Second Semester',
          }
        });

        if (firstSemester) {
          // find GPA
          const levelGrades = await GRADE.findAll({
            where: {
              studentId: studentData.id,
              studentLevel: lvl,
              semesterId: firstSemester.get('id'),
            },
            include: [{
              model: COURSE,
              as: 'course',
              required: true,
            }]
          });

          let totalGradePointsGained = levelGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
          let totalUnits = levelGrades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

          const semesterGPA = totalUnits > 0
            ? totalGradePointsGained / totalUnits
            : 0;

          allGPAs[`first${lvl}`] = parseFloat(semesterGPA.toFixed(2));
        }

        if (secondSemester) {
          // find GPA
          const levelGrades = await GRADE.findAll({
            where: {
              studentId: studentData.id,
              studentLevel: lvl,
              semesterId: secondSemester.get('id'),
            },
            include: [{
              model: COURSE,
              as: 'course',
              required: true,
            }]
          });

          let totalGradePointsGained = levelGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
          let totalUnits = levelGrades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

          const semesterGPA = totalUnits > 0
            ? totalGradePointsGained / totalUnits
            : 0;

          allGPAs[`second${lvl}`] = parseFloat(semesterGPA.toFixed(2));
        }
      }

      // calculate CGPA - use all the person's assigned grades
      const allGrades = await GRADE.findAll({
        where: {
          studentId: studentData.id,
        },
        include: [{
          model: COURSE,
          as: 'course',
          required: true,
        }]
      })

      const totalGradePointsGainedForAllCourses = allGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
      const totalUnits = allGrades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

      const CGPA = totalUnits > 0
        ? totalGradePointsGainedForAllCourses / totalUnits
        : 0;

      return { ...studentData, currentCGPA: parseFloat(CGPA.toFixed(2)), ...allGPAs };
    }));

    res
      .status(200)
      .json({
        message: 'Success',
        data: { students: studentsWithCGPA, total: result.count },
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const [adminEmail, adminPass] = [process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD];

    if (email !== adminEmail) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, adminPass as string);

    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    res.status(200).json({ message: 'Success', data: token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getTranscript(req: Request, res: Response) {
  try {
    const {studentId} = req.params;

    if (!studentId) {
      res.status(400).json({message: 'Invalid student ID'});
      return;
    }

    // fetch the student bare details
    const studentInfo = await STUDENT.findByPk(studentId);

    if (!studentInfo) {
      res.status(404).json({message: 'Student not found'});
      return;
    }

    // add cgpa to studentInfo
    // calculate CGPA - use all the person's assigned grades
    const allGrades = await GRADE.findAll({
      where: {
        studentId: studentId,
      },
      order: [[{ model: SESSION, as: 'session' }, 'createdAt', 'ASC']],
      include: [
        {
          model: COURSE,
          as: 'course',
          required: true,
        },
        {
          model: SEMESTER,
          as: 'semester',
          required: true
        },
        {
          model: SESSION,
          as: 'session',
          required: true
        }
      ],
    })

    const totalGradePointsGainedForAllCourses = allGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
    const totalUnits = allGrades.reduce((acc, grade) => acc + (grade.get('course') as {units: number}).units, 0);

    const CGPA = totalUnits > 0
      ? totalGradePointsGainedForAllCourses / totalUnits
      : 0;

    const updatedStudentInfo = { ...studentInfo.toJSON(), cgpa: CGPA.toFixed(2) }

    // get all grades
    const grades = allGrades.map(x => x.toJSON());

    // gpa summary
    const gpaSummary = groupBy(grades, grade => grade.session.name);

    let cumHrs = 0;
    let cumPts = 0;

    Object.keys(gpaSummary).forEach(session => {
      gpaSummary[session] = groupBy(gpaSummary[session], grade => grade.semester.name);

      // writing it out manually to maintain order
      ['First Semester', 'Second Semester', 'Summer Semester'].forEach(semester => {
        if (!gpaSummary[session][semester]) {
          return;
        }

        const totalHrs = gpaSummary[session][semester].reduce((acc: number, grade: any) => acc + grade.course.units, 0);
        const totalPts = gpaSummary[session][semester].reduce((acc: number, grade: any) => acc + grade.gradePoint, 0);

        const semesterGPA = totalHrs > 0
          ? totalPts / totalHrs
          : 0;

        cumPts += totalPts;
        cumHrs += totalHrs;
          
        gpaSummary[session][semester] = {
          gpa: semesterGPA.toFixed(2),
          cumHrs: cumHrs,
          cgpa: (cumPts / cumHrs).toFixed(2)
        }
      });
    });
    
    res.status(200).json({message: 'Success', data: {studentInfo: updatedStudentInfo, grades, gpaSummary}});
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

function groupBy(array: any[], keyFunction: (x: any) => any) {
  return array.reduce((result, currentItem) => {
    const key = keyFunction(currentItem);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentItem);
    return result;
  }, {});
}
