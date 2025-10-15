import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Notifiche', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tipo : {
            type: DataTypes.STRING,
            allowNull: false
        },
        messaggio : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
         visualizzato: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_utente: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Utenti',
                key: 'id'
            }
        }
    });
}