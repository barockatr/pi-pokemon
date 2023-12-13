const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Type = sequelize.define('type', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};