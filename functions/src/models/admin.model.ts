import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const ADMIN = sequelize.define("Admin", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {timestamps: true});

await sequelize.sync();

export default ADMIN;