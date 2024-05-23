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

(async () => {
  await sequelize.sync();
})();

GRADE.belongsTo(COURSE, { foreignKey: 'courseId', as: 'course'});

export default GRADE;