import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Ricerche', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        criteri: {
            type: DataTypes.JSON,
            allowNull: false
        },
        id_utente: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Utenti',
                key: 'id'
            }
        },
    });
}