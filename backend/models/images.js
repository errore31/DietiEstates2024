import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Images', {
        url : {
            type: DataTypes.STRING,
            allowNull: false,
            unique : true
        },
        order : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        description : {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
}