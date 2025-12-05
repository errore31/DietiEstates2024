import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('ProprietiesFeatures', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Proprieties',
                key: 'id'
            }
        },
        roomCount:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        area: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hasElevator: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        floor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        energyClass: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
}