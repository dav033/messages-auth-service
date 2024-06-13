const { DataTypes } = require("sequelize");

const sequelize = require("../config/sequelize.config");

const User_auth = sequelize.define(
  "User_auth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User_auth;
