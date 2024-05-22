import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const SEMESTER = sequelize.define("Semester", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {timestamps: true});

(async () => {
  await sequelize.sync();
})();

export default SEMESTER;