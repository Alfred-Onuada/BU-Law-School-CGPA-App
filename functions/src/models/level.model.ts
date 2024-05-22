import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const LEVEL = sequelize.define("Level", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {timestamps: true});

(async () => {
  await sequelize.sync();
})();

export default LEVEL;