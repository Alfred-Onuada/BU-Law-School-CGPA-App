import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const SESSION = sequelize.define("Session", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {timestamps: true});

await sequelize.sync();

export default SESSION;