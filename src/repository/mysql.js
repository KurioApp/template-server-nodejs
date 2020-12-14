import Sequelize from "sequelize";

export default function MysqlORM(dbHost, dbName, dbUser, dbPass, options) {
  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    operatorsAliases: false,
    dialect: "mysql",
    logging: false,

    pool: {
      max: options.pool.max,
      min: options.pool.min,
      acquire: options.pool.acquire,
      idle: options.pool.idle
    }
  });

  return {
    sequelize,
    Sequelize
  };
}
