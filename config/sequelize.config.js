const { Sequelize } = require("sequelize");
const db_config = require("./db.config");

console.log(db_config);

const sequelize = new Sequelize(
  "authMessages",
  db_config.user,
  db_config.password,
  {
    host: db_config.host,
    dialect: "mysql",
  }
);

sequelize
  .sync({ force: false }) // Si estableces force en true, esto eliminará y recreará las tablas en cada reinicio de la aplicación
  .then(() => {
    console.log("Tablas sincronizadas con éxito");
  })
  .catch((err) => {
    console.error("Error al sincronizar tablas:", err);
  });

module.exports = sequelize;
