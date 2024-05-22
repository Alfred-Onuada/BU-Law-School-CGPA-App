import { config } from 'dotenv';
config();

import { Sequelize } from 'sequelize';

let sequelize!: Sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DB_URI as string, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize({
    database: process.env.DEV_DB_NAME as string,
    username: process.env.DEV_DB_USER as string,
    password: process.env.DEV_DB_PASS as string,
    host: process.env.DEV_DB_HOST as string,
    dialect: 'mysql',
  });

}

(async () => {
  try {
    await sequelize.authenticate();
    console.info('DB Connection has been established successfully.');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
})();

export default sequelize;
