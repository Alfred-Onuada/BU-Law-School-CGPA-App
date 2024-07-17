import sequelize from "../config/db";
import { DataTypes } from "sequelize";
import SEMESTER from "./semester.model";

const COURSE = sequelize.define("Course", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  units: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level: {
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
  },
}, {timestamps: true});

(async () => {
  await sequelize.sync();
})();

COURSE.belongsTo(SEMESTER, { foreignKey: 'semesterId', as: 'semester'});

export default COURSE;
