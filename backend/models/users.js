import { DataTypes } from 'sequelize';

export function createModel(database){
    database.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname : {
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
            allowNull: true 
        },
        //google identifier
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        role : {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        receivePromos : {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        receiveProperties : {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
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