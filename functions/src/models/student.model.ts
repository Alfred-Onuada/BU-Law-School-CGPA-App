import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const STUDENT = sequelize.define("Student", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yearEnrolled: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  levelAtEnrollment: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {timestamps: true});

// create the derived field GPA and CGPA from grades

await sequelize.sync();

export default STUDENT;