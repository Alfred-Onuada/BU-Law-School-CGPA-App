import sequelize from "../config/db";
import { DataTypes } from "sequelize";
import COURSE from "./course.model";

const GRADE = sequelize.define("Grade", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gradePoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semesterId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {timestamps: true});

// Function to recalculate gradePoint based on Course details
export async function recalculateGradePoint(courseId: string, newUnits: number) {
  const grades = await GRADE.findAll({ where: { courseId } });
  for (const grade of grades) {
    const gradeLetter = (grade as any).grade;
    (grade as any).gradePoint = newUnits * (gradeLetter === 'A' ? 5 : gradeLetter === 'B' ? 4 : gradeLetter === 'C' ? 3 : gradeLetter === 'D' ? 2 : gradeLetter === 'E' ? 1 : 0)
    await grade.save();
  }
};

(async () => {
  await sequelize.sync();
})();

GRADE.belongsTo(COURSE, { foreignKey: 'courseId', as: 'course'});

export default GRADE;