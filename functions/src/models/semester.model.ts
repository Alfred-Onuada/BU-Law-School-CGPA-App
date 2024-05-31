import sequelize from '../config/db';
import { DataTypes } from 'sequelize';

const SEMESTER = sequelize.define(
  'Semester',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'sessionId'],
      },
    ],
  }
);

(async () => {
  await sequelize.sync();
})();

export default SEMESTER;
