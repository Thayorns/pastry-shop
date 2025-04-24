if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize; // Connect to DB
db.Sequelize = Sequelize; // The Sequelize class itself

module.exports = db;
