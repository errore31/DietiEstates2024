import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Caratteristiche_imobili', {
            id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        numero_stanze:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dimensioni: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ascensore: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        piano: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        classe_energetica: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
}