import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define("proprieties", {
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
        latitude:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        agentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Utenti',
                key: 'id'
            }
        },
        featuresId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Caratteristiche_immobili',
                key: 'id'
            }
        }
        });
}