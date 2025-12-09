import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Searches', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        criteria: {
            type: DataTypes.JSON,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    });
}