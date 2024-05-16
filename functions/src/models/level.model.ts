import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const LEVEL = sequelize.define("Level", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {timestamps: true});

export default LEVEL;