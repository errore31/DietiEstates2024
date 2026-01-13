import { Sequelize } from "sequelize";
import bcrypt from 'bcrypt';
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
export async function startConnection(){
  try {
    await database.authenticate();
    await database.sync({  alter: true });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export async function setDataTest(){
  try {
    await database.sync({ force: true });
    const hashedPassword = await bcrypt.hash('agentpassword', 10);
    const agency = await Agencies.create({
      businessName: 'Best Estates',
      name: 'Best Estates Agency',
      address: '123 Main St, Cityville',
      phone: '123-456-7890',
      email: 'bestestates@example.com'
    });

    const user = await Users.create({
      name: 'Alice',
      surname: 'Smith',
      username: 'alicesmith',
      email: 'alicesmith@example.com',
      password: hashedPassword,
      role: 'user',
    });

    const admin = await Users.create({
      name: 'Admin',
      surname: 'User',
      username: 'adminuser',
      email: 'adminuser@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    const adminAgency = await Users.create({
      name: 'AgencyAdmin',
      surname: 'User',
      username: 'agencyadmin',
      email: 'agencyadmin@example.com',
      password: hashedPassword,
      role: 'agencyAdmin',
      agencyId: agency.id
    });

    const agent = await Users.create({
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      role: 'agent',
      agencyId: agency.id
    });

    const property =  await Properties.create({
      title: 'Beautiful Family Home',
      description: 'A lovely 3-bedroom family home in a great neighborhood.',
      price: 350000,
      address: '456 Oak St, Cityville',
      type: 'house',
      latitude: 40.7128,
      longitude: -74.0060,
      agentId: agent.id
    });

    await PropertiesFeatures.create({
      id: property.id,
      roomCount: 3,
      area: 120,
      hasElevator: false,
      floor: 1,
      energyClass: 'B'
    });

    await Images.create({
      url: 'https://picsum.photos/seed/property/800/600',
      order: 0,
      propertyId: property.id
    });

    await Searches.create({
      criteria: { maxPrice: 400000, type: 'house' },
      userId: agent.id
    });

    await Notifications.create({
      type: 'welcome',
      message: 'Benvenuto sulla piattaforma!',
      userId: agent.id
    });

    console.log('Test data initialized successfully.');
  } catch (error) {
    console.error('Error initializing test data:', error);
    throw error;
  }
}