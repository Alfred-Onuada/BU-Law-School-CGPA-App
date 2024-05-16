import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const STUDENT = sequelize.define("Student", {
  id: {
    type: DataTypes.UUIDV4,
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
  levelId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {timestamps: true});

export default STUDENT;