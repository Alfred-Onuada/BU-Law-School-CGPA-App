import { Request, Response } from "express";
import SESSION from "../models/session.model";
import SEMESTER from "../models/semester.model";
import LEVEL from "../models/level.model";
import STUDENT from "../models/student.model";
import { Op } from "sequelize";
import sequelize from "sequelize/lib/sequelize";

export async function getSessions(_: Request, res: Response) {
  try {
    const sessions = await SESSION.findAll({ order: [["startYear", "DESC"]] });

    res.status(200).json({message: "Success", data: sessions});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSession(req: Request, res: Response) {
  try {
    const { name, startYear } = req.body;
    const session = await SESSION.create({ name, startYear });

    res.status(201).json({ message: "Success", data: session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSemesters(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const semesters = await SEMESTER.findAll({ where: { sessionId } });

    res.status(200).json({ message: "Success", data: { semesters, session } });
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
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const semester = await SEMESTER.create({ name, sessionId });

    res.status(201).json({ message: "Success", data: semester });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getLevels(_: Request, res: Response) {
  try {
    const levels = await LEVEL.findAll({ order: [["name", "ASC"]] });

    res.status(200).json({message: "Success", data: levels});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSemesterAndSessionDetails(req: Request, res: Response) {
  try {
    const { semesterId } = req.params;
    const semester = await SEMESTER.findByPk(semesterId);

    if (!semester) {
      res.status(404).json({ message: "Semester not found" });
      return;
    }

    const session = await SESSION.findByPk(semester.toJSON().sessionId);

    res.status(200).json({ message: "Success", data: { semester, session } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createLevel(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const level = await LEVEL.create({ name });

    res.status(201).json({ message: "Success", data: level });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSemester(req: Request, res: Response) {
  try {
    const { semesterId } = req.params;
    const semester = await SEMESTER.findByPk(semesterId);

    if (!semester) {
      res.status(404).json({ message: "Semester not found" });
      return;
    }

    res.status(200).json({ message: "Success", data: semester });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


export async function getSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    res.status(200).json({ message: "Success", data: session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const studentInfo = req.body;

    if (typeof studentInfo !== 'object' || Object.keys(studentInfo).length === 0) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    await STUDENT.create(studentInfo);

    res.status(201).json({ message: "Success" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export async function createStudentsBulk(req: Request, res: Response) {
  try {
    const studentsInfo = req.body;

    if (!Array.isArray(studentsInfo) || studentsInfo.length === 0) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    await STUDENT.bulkCreate(studentsInfo);

    res.status(201).json({ message: "Success" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export async function getStudents(req: Request, res: Response) {
  try {
    const { sessionId, level } = req.query;

    if (!sessionId || !level) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }

    // get session info
    const session = await SESSION.findByPk(sessionId as string);

    // check start year
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    const sessionStartYear = session.toJSON().startYear;

    // Ensure the level is an integer
    const requestedLevel = parseInt(level as string);
    if (isNaN(requestedLevel)) {
      res.status(400).json({ message: "Invalid level query parameter" });
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
    if (typeof req.query.page === 'string' && parseInt(req.query.page as string) >= 1) {
      page = parseInt(req.query.page as string);
      skip = (page - 1) * limit;
    }

    // check for search query
    let query = '';
    let queryClause = {};
    if (typeof req.query.query === 'string' && req.query.query.trim().length >= 2) {
      query = req.query.query;
      queryClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } }
        ]
      };
    }

    // Calculate the year difference to determine current level
    const currentLevelClause = {
      [Op.and]: [
        sequelize.where(
          sequelize.fn(
            'FLOOR',
            sequelize.literal("(" + sessionStartYear + " - `yearEnrolled`) + (`levelAtEnrollment` / 100)")
          ),
          requestedLevel / 100
        )
      ]
    };

    // Merge query clauses
    queryClause = {
      ...queryClause,
      ...currentLevelClause
    };

    const result = await STUDENT.findAndCountAll({
      where: queryClause,
      order: [["lastName", "ASC"]],
      limit,
      offset: skip,
    });

    // Adding CGPA and semesterGPA fields with default values to each student
    const studentsWithGPA = result.rows.map(student => ({
      ...student.toJSON(),
      CGPA: 0,
      semesterGPA: 0
    }));

    res.status(200).json({ message: "Success", data: { students: studentsWithGPA, total: result.count } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}