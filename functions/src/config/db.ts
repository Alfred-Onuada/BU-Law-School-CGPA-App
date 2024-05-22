import {config} from "dotenv";
config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database:
    process.env.NODE_ENV !== 'production' ?
      process.env.DEV_DB_NAME :
      process.env.DB_NAME,
  username:
    process.env.NODE_ENV !== 'production' ?
      process.env.DEV_DB_USER :
      process.env.DB_USER,
  password:
    process.env.NODE_ENV !== 'production' ?
      process.env.DEV_DB_PASS :
      process.env.DB_PASS,
  host:
    process.env.NODE_ENV !== 'production' ?
      process.env.DEV_DB_HOST :
      process.env.DB_HOST,
  dialect: process.env.NODE_ENV !== 'production' ? "mysql" : "postgres",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.info("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
})();

export default sequelize;