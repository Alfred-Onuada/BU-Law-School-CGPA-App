import { Request, Response } from 'express';
import SESSION from '../models/session.model';
import SEMESTER from '../models/semester.model';
import LEVEL from '../models/level.model';
import STUDENT from '../models/student.model';
import { Op } from 'sequelize';
import sequelize from 'sequelize/lib/sequelize';
import COURSE from '../models/course.model';
import GRADE from '../models/grade.model';

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

    const semesters = await SEMESTER.findAll({ where: { sessionId } });

    res.status(200).json({ message: 'Success', data: { semesters, session } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSemester(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const semester = await SEMESTER.create({ name, sessionId });

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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

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

      const allCoursesWithinSemester = await COURSE.findAll({
        where: {
          semesterId,
          sessionId,
          level,
        }
      });

      let totalGradePointsGained = grades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
      let totalPossibleGradePoints = allCoursesWithinSemester.reduce((acc, course) => acc + (course.get('units') as number) * 5, 0);

      const semesterGPA = totalPossibleGradePoints > 0
        ? (totalGradePointsGained / totalPossibleGradePoints) * 5
        : 0;

      // I need to run the calculation for CGPA
      const levels = [100, 200, 300, 400, 500, 600].filter(level => level >= (student.get('levelAtEnrollment') as number));

      let cumulativeTotalGradePointsGained = 0;
      let cumulativeTotalPossibleGradePoints = 0;

      for (const lvl of levels) {
        const levelGrades = await GRADE.findAll({
          where: {
            studentId: studentData.id,
            studentLevel: lvl,
          },
          include: [{
            model: COURSE,
            as: 'course',
            required: true,
          }]
        });

        const allCoursesWithinLevel = await COURSE.findAll({
          where: {
            level: lvl,
          }
        });

        cumulativeTotalGradePointsGained += levelGrades.reduce((acc, grade) => acc + (grade.get('gradePoint') as number), 0);
        cumulativeTotalPossibleGradePoints += allCoursesWithinLevel.reduce((acc, course) => acc + (course.get('units') as number) * 5, 0);
      }

      console.log(cumulativeTotalGradePointsGained, cumulativeTotalPossibleGradePoints);

      const CGPA = cumulativeTotalPossibleGradePoints > 0
        ? (cumulativeTotalGradePointsGained / cumulativeTotalPossibleGradePoints) * 5
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
    console.log(error);
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

    // this is how upsert works in sequelize, the fields array is used to specify the fields to update
    // the updateOnDuplicate option is used to specify the fields to update when the primary key already exists
    await COURSE.bulkCreate(courses, { updateOnDuplicate: ['name', 'units'] });

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
