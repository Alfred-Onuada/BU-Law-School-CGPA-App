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
  levelId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {timestamps: true});

await sequelize.sync();

export default STUDENT;