import { Sequelize } from 'sequelize';
import config from './config.json' with { type: 'json' };

const { database, username, password, host, port, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
});

export default sequelize;