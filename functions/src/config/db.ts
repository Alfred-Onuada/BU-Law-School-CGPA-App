import {config} from "dotenv";
config();

import { Sequelize } from "sequelize";
import * as logger from "firebase-functions/logger";

const sequelize = new Sequelize({
  database:
    process.env.FUNCTIONS_EMULATOR ?
      process.env.DEV_DB_NAME :
      process.env.DB_NAME,
  username:
    process.env.FUNCTIONS_EMULATOR ?
      process.env.DEV_DB_USER :
      process.env.DB_USER,
  password:
    process.env.FUNCTIONS_EMULATOR ?
      process.env.DEV_DB_PASS :
      process.env.DB_PASS,
  host:
    process.env.FUNCTIONS_EMULATOR ?
      process.env.DEV_DB_HOST :
      process.env.DB_HOST,
  dialect: 'mysql',
});

try {
  await sequelize.authenticate();
  logger.info("DB Connection has been established successfully.");
} catch (error) {
  logger.error("Error connecting to database: ", error);
}

export default sequelize;