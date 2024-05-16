import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const SEMESTER = sequelize.define("Semester", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {timestamps: true});

export default SEMESTER;