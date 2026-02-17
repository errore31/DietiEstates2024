import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define("Properties", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price:{
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        address:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        category:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude:{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        longitude:{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        agentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: true,
        },
    });
}