import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const GRADE = sequelize.define("Grade", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {timestamps: true});

export default GRADE;