import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const COURSE = sequelize.define("Course", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  units: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  levelId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  semesterId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
}, {timestamps: true});

export default COURSE;
