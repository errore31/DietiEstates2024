import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define("Immobili", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titolo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descrizione: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        prezzo:{
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        indirizzo:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        posizione_lat:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        posizione_lng:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        id_agente: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Utenti',
                key: 'id'
            }
        },
        id_caratteristiche: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Caratteristiche_immobili',
                key: 'id'
            }
        }
        });
}