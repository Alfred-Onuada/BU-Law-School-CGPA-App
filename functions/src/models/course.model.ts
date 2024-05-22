import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const COURSE = sequelize.define("Course", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
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
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  semesterId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
}, {timestamps: true});

(async () => {
  await sequelize.sync();
})();

export default COURSE;
