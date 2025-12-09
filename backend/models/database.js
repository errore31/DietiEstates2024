import { Sequelize } from "sequelize";
import { createModel as createAgenciesModel } from "./agencies.js";
import { createModel as createUserModel } from "./users.js";
import { createModel as createPropertiesModel } from "./properties.js";
import { createModel as createCaratteristichePropertiesModel } from "./propertiesFeatures.js";
import { createModel as createNotificationsModel} from "./notifications.js";
import { createModel as createSearchesModel} from "./searches.js";

const database = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_PATH || './data/database.db',
    logging: false 
});

createUserModel(database);
createAgenciesModel(database);
createPropertiesModel(database);
createCaratteristichePropertiesModel(database);
createNotificationsModel(database);
createSearchesModel(database);

export const { Users, Agencies, Properties, PropertiesFeatures, Notifications, Searches } = database.models;

Agencies.hasMany(Users, { foreignKey: 'agencyId' });
Users.belongsTo(Agencies, { foreignKey: 'agencyId' });

Users.hasMany(Properties, { foreignKey: 'agentId' });
Properties.belongsTo(Users, { foreignKey: 'agentId' });

Users.hasMany(Notifications, { foreignKey: 'userId' });
Notifications.belongsTo(Users, { foreignKey: 'userId' });

Users.hasMany(Searches, { foreignKey: 'userId' });
Searches.belongsTo(Users, { foreignKey: 'userId' });

PropertiesFeatures.belongsTo(Properties, { foreignKey: 'id' });
Properties.hasOne(PropertiesFeatures, { foreignKey: 'id' });

export default database;