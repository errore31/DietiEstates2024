import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Utenti', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome : {
            type: DataTypes.STRING,
            allowNull: false
        },
        cognome : {
            type: DataTypes.STRING,
            allowNull: false
        },
        username : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false
        },
        ruolo : {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        agencyId : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Agencies',
                key: 'id'
            }
        }
    });
}