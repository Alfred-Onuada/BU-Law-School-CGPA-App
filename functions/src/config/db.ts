import { config } from 'dotenv';
config();

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.NODE_ENV === 'production' ? process.env.DB_NAME as string : process.env.DEV_DB_NAME as string,
  username: process.env.NODE_ENV === 'production' ? process.env.DB_USER as string : process.env.DEV_DB_USER as string,
  password: process.env.NODE_ENV === 'production' ? process.env.DB_PASS as string : process.env.DEV_DB_PASS as string,
  host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST as string : process.env.DEV_DB_HOST as string,
  port: parseInt(process.env.NODE_ENV === 'production' ? process.env.DB_PORT as string : process.env.DEV_DB_PORT as string),
  dialect: 'mysql',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.info('DB Connection has been established successfully.');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
})();

export default sequelize;
