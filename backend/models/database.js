import { Sequelize } from "sequelize";
import { createModel as createAgenciesModel } from "./agencies.js";
import { createModel as createUserModel } from "./users.js";
import { createModel as createPropertiesModel } from "./properties.js";
import { createModel as createCaratteristichePropertiesModel } from "./propertiesFeatures.js";
import { createModel as createNotificationsModel} from "./notifications.js";
import { createModel as createSearchesModel} from "./searches.js";
import {createModel as createImagesModel} from "./images.js";

const database = new Sequelize(
  process.env.DB_NAME || 'dietiestates',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres', 
    retry: { // if connection fails, retry
      match: [/ECONNREFUSED/],
      max: 5 
    },
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

createUserModel(database);
createAgenciesModel(database);
createPropertiesModel(database);
createCaratteristichePropertiesModel(database);
createNotificationsModel(database);
createSearchesModel(database);
createImagesModel(database);

export const { Users, Agencies, Properties, PropertiesFeatures, Notifications, Searches, Images } = database.models;

Agencies.hasMany(Users, { foreignKey: 'agencyId', onDelete: 'CASCADE' });
Users.belongsTo(Agencies, { foreignKey: 'agencyId' });

Users.hasMany(Properties, { foreignKey: 'agentId', onDelete: 'SET NULL'});
Properties.belongsTo(Users, { foreignKey: 'agentId' });

Users.hasMany(Notifications, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notifications.belongsTo(Users, { foreignKey: 'userId' });

Users.hasMany(Searches, { foreignKey: 'userId', onDelete: 'CASCADE' });
Searches.belongsTo(Users, { foreignKey: 'userId' });

PropertiesFeatures.belongsTo(Properties, { foreignKey: 'id', onDelete: 'CASCADE' });
Properties.hasOne(PropertiesFeatures, { foreignKey: 'id', onDelete: 'CASCADE' });

Properties.hasMany(Images, { foreignKey: 'propertyId', allowNull: false, onDelete: 'CASCADE' });
Images.belongsTo(Properties, { foreignKey: 'propertyId' });

export default database;