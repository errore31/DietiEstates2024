import { Sequelize } from "sequelize";
import { createModel as createAgenziaModel } from "./agenzie.js";
import { createModel as createUtentiModel } from "./utenti.js";
import { createModel as createImmobiliModel } from "./immobili.js";
import { createModel as createCaratteristicheImmobiliModel } from "./caratteristiche_immobili.js";
import {createModel as createNotificheModel} from "./notifiche.js";
import {createModel as createRicercheModel} from "./ricerche.js";

const database = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_PATH || './data/database.db',
    logging: false 
});

createUtentiModel(database);
createAgenziaModel(database);
createImmobiliModel(database);
createCaratteristicheImmobiliModel(database);
createNotificheModel(database);
createRicercheModel(database);

export const { Utenti, Agenzie, Immobili, Caratteristiche_Immobili, Notifiche, Ricerche } = database.models;

Agenzie.hasMany(Utenti, { foreignKey: 'id_agenzia' });
Utenti.belongsTo(Agenzie, { foreignKey: 'id_agenzia' });

Utenti.hasMany(Immobili, { foreignKey: 'id_agente' });
Immobili.belongsTo(Utenti, { foreignKey: 'id_agente' });

Utenti.hasMany(Notifiche, { foreignKey: 'id_utente' });
Notifiche.belongsTo(Utenti, { foreignKey: 'id_utente' });

Utenti.hasMany(Ricerche, { foreignKey: 'id_utente' });
Ricerche.belongsTo(Utenti, { foreignKey: 'id_utente' });

Immobili.belongsTo(Caratteristiche_Immobili, { foreignKey: 'id_caratteristiche' });
Caratteristiche_Immobili.hasOne(Immobili, { foreignKey: 'id_caratteristiche' });

export default database;