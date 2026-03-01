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
    await database.sync({ alter: true });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

async function createAgencyAndUsers(hashedPassword) {
  // 1. Crea Agenzia
  const agency = await Agencies.create({
    businessName: 'Best Estates',
    name: 'Best Estates Agency',
    address: '123 Main St, Cityville',
    phone: '+39 3481754639',
    email: 'bestestates@example.com'
  });

  // 2. Crea Utenti
  await Users.create({
    name: 'Alice',
    surname: 'Smith',
    username: 'alicesmith',
    email: 'alicesmith@example.com',
    password: hashedPassword,
    role: 'user',
  });

  await Users.create({
    name: 'Admin',
    surname: 'User',
    username: 'adminuser',
    email: 'adminuser@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  await Users.create({
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

  // Ritorniamo l'agente perché ci serve il suo ID per creare le proprietà
  return agent;
}

/**
 * Crea le 4 proprietà, le caratteristiche e le immagini collegate a un agente specifico
 */
async function createPropertiesForAgent(agentId) {
  const propertiesData = [
    {
      title: 'Beautiful Family Home',
      description: 'A lovely 3-bedroom family home in a great neighborhood.',
      price: 350000,
      address: '456 Oak St, Cityville',
      type: 'house',
      category: 'vendita',
      latitude: 40.7128, longitude: -74.0060,
      features: { roomCount: 3, area: 120, hasElevator: false, floor: 1, energyClass: 'B' }
    },
    {
      title: 'Modern City Apartment',
      description: 'Luxurious apartment in the heart of the city.',
      price: 550000,
      address: '789 Pine Ave, Cityville',
      type: 'apartment',
      category: 'vendita',
      latitude: 40.7138, longitude: -74.0070,
      features: { roomCount: 2, area: 90, hasElevator: true, floor: 5, energyClass: 'A' }
    },
    {
      title: 'Cozy Studio Loft',
      description: 'Perfect for singles or young couples.',
      price: 180000,
      address: '101 Maple Blvd, Cityville',
      type: 'studio',
      category: 'affitto',
      latitude: 40.7118, longitude: -74.0050,
      features: { roomCount: 1, area: 45, hasElevator: true, floor: 2, energyClass: 'C' }
    },
    {
      title: 'Spacious Villa with Garden',
      description: 'Exclusive villa with private pool.',
      price: 950000,
      address: '202 Hilltop Rd, Cityville',
      type: 'villa',
      category: 'affitto',
      latitude: 40.7158, longitude: -74.0090,
      features: { roomCount: 5, area: 250, hasElevator: false, floor: 0, energyClass: 'A+' }
    }
  ];

  for (const propData of propertiesData) {
    const property = await Properties.create({
      title: propData.title,
      description: propData.description,
      price: propData.price,
      address: propData.address,
      type: propData.type,
      category: propData.category,
      latitude: propData.latitude,
      longitude: propData.longitude,
      agentId: agentId
    });

    await PropertiesFeatures.create({
      id: property.id,
      ...propData.features // Spread operator per copiare roomCount, area, etc.
    });

    await Images.create({
      url: `https://picsum.photos/seed/${property.id}/800/600`,
      order: 0,
      propertyId: property.id
    });
  }
}

/**
 * Crea dati accessori come ricerche salvate e notifiche
 */
async function createExtras(userId) {
  await Searches.create({
    criteria: { maxPrice: 400000, type: 'house' },
    userId: userId
  });

  await Notifications.create({
    type: 'welcome',
    message: 'Benvenuto sulla piattaforma!',
    userId: userId
  });
}

// --- FUNZIONE PRINCIPALE (ESPORTATA) ---

export async function setDataTest() {
  try {
    console.log('Starting data initialization...');
    
    // 1. Reset Database
    await database.sync({ force: true });

    // 2. Preparazione
    const hashedPassword = await bcrypt.hash('agentpassword', 10);

    // 3. Esecuzione Step Logici
    const agent = await createAgencyAndUsers(hashedPassword); // Crea Utenti
    await createPropertiesForAgent(agent.id);                 // Crea Proprietà
    await createExtras(agent.id);                             // Crea Extra

    console.log('Test data initialized successfully.');
  } catch (error) {
    console.error('Error initializing test data:', error);
    throw error;
  }
}