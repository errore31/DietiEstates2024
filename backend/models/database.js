import { Sequelize } from "sequelize";
import { createModel as createAgenziaModel } from "./agenzie.js";
import { createModel as createUtentiModel } from "./utenti.js";
import { createModel as createProprietiesModel } from "./proprieties.js";
import { createModel as createCaratteristicheProprietiesModel } from "./caratteristiche_Proprieties.js";
import {createModel as createNotificheModel} from "./notifiche.js";
import {createModel as createRicercheModel} from "./ricerche.js";

const database = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_PATH || './data/database.db',
    logging: false 
});

createUtentiModel(database);
createAgenziaModel(database);
createProprietiesModel(database);
createCaratteristicheProprietiesModel(database);
createNotificheModel(database);
createRicercheModel(database);

export const { Utenti, Agenzie, Proprieties, Caratteristiche_Proprieties, Notifiche, Ricerche } = database.models;

Agenzie.hasMany(Utenti, { foreignKey: 'id_agenzia' });
Utenti.belongsTo(Agenzie, { foreignKey: 'id_agenzia' });

Utenti.hasMany(Proprieties, { foreignKey: 'id_agente' });
Proprieties.belongsTo(Utenti, { foreignKey: 'id_agente' });

Utenti.hasMany(Notifiche, { foreignKey: 'id_utente' });
Notifiche.belongsTo(Utenti, { foreignKey: 'id_utente' });

Utenti.hasMany(Ricerche, { foreignKey: 'id_utente' });
Ricerche.belongsTo(Utenti, { foreignKey: 'id_utente' });

Proprieties.belongsTo(Caratteristiche_Proprieties, { foreignKey: 'id_caratteristiche' });
Caratteristiche_Proprieties.hasOne(Proprieties, { foreignKey: 'id_caratteristiche' });

export default database;