/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
import { Sequelize } from 'sequelize';

const db = new Sequelize('app', '', '', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export const dbTest = new Sequelize('app', '', '', {
  dialect: 'sqlite',
  storage: ':memory',
  logging: false,
});

export default process.env.NODE_ENV === 'test' ? dbTest : db;
