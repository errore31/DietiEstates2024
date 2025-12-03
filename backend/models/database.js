import { Sequelize } from "sequelize";
import { createModel as createAgencyModel } from "./agencies.js";
import { createModel as createUtentiModel } from "./utenti.js";
import { createModel as createProprietiesModel } from "./proprieties.js";
import { createModel as createCaratteristicheProprietiesModel } from "./proprietiesfeatures.js";
import { createModel as createNotificheModel} from "./notifiche.js";
import { createModel as createRicercheModel} from "./ricerche.js";

const database = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_PATH || './data/database.db',
    logging: false 
});

createUtentiModel(database);
createAgencyModel(database);
createProprietiesModel(database);
createCaratteristicheProprietiesModel(database);
createNotificheModel(database);
createRicercheModel(database);

export const { Utenti, Agencies, Proprieties, ProprietiesFeatures, Notifiche, Ricerche } = database.models;

Agencies.hasMany(Utenti, { foreignKey: 'agencyId' });
Utenti.belongsTo(Agencies, { foreignKey: 'agencyId' });

Utenti.hasMany(Proprieties, { foreignKey: 'agentId' });
Proprieties.belongsTo(Utenti, { foreignKey: 'agentId' });

Utenti.hasMany(Notifiche, { foreignKey: 'id_utente' });
Notifiche.belongsTo(Utenti, { foreignKey: 'id_utente' });

Utenti.hasMany(Ricerche, { foreignKey: 'id_utente' });
Ricerche.belongsTo(Utenti, { foreignKey: 'id_utente' });

ProprietiesFeatures.belongsTo(Proprieties, { foreignKey: 'id' });
Proprieties.hasOne(ProprietiesFeatures, { foreignKey: 'id' });

export default database;