import { Sequelize } from "sequelize";
import * as logger from "firebase-functions/logger";

const sequelize = new Sequelize({
  database:
    process.env.NODE_ENV === "production" ?
      process.env.DB_NAME :
      process.env.DEV_DB_NAME,
  username:
    process.env.NODE_ENV === "production" ?
      process.env.DB_USER :
      process.env.DEV_DB_USER,
  password:
    process.env.NODE_ENV === "production" ?
      process.env.DB_PASS :
      process.env.DEV_DB_PASS,
  host:
    process.env.NODE_ENV === "production" ?
      process.env.DB_HOST :
      process.env.DEV_DB_HOST,
  dialect: 'mysql',
});

try {
  await sequelize.authenticate();
  logger.info("DB Connection has been established successfully.");
} catch (error) {
  logger.error("Error connecting to database: ", error);
}

export default sequelize;