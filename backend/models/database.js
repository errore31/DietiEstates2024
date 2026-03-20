import { Sequelize } from "sequelize";
import bcrypt from 'bcrypt';
import { createModel as createAgenciesModel } from "./agencies.js";
import { createModel as createUserModel } from "./users.js";
import { createModel as createPropertiesModel } from "./properties.js";
import { createModel as createCaratteristichePropertiesModel } from "./propertiesFeatures.js";
import { createModel as createNotificationsModel } from "./notifications.js";
import { createModel as createSearchesModel } from "./searches.js";
import { createModel as createImagesModel } from "./images.js";
import { createModel as createRequestAgenciesModel } from "./requestAgency.js";

const database = new Sequelize(
  process.env.DB_NAME || 'dietiestates',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    retry: {
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
createRequestAgenciesModel(database);

export const { Users, Agencies, Properties, PropertiesFeatures, Notifications, Searches, Images, RequestAgencies } = database.models;

Agencies.hasMany(Users, { foreignKey: 'agencyId', onDelete: 'CASCADE' });
Users.belongsTo(Agencies, { foreignKey: 'agencyId' });

Users.hasMany(Properties, { foreignKey: 'agentId', onDelete: 'SET NULL' });
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
export async function startConnection() {
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
  const agency = await Agencies.create({
    businessName: 'Best Estates',
    name: 'Best Estates Agency',
    address: '123 Main St, Cityville',
    phone: '+39 3481754639',
    email: 'bestestates@example.com'
  });

  const alice = await Users.create({
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

  return { agent, alice };
}
async function createPropertiesForAgent(agentId) {
  const propertiesData = [
    {
      title: 'Trilocale Vista Duomo',
      description: 'Elegante appartamento ristrutturato con finiture di pregio e affaccio panoramico.',
      price: 890000,
      address: 'Via Torino 15, Milano',
      type: 'appartamento',
      category: 'vendita',
      latitude: 45.4627, longitude: 9.1865,
      features: { roomCount: 3, area: 110, hasElevator: true, floor: 4, energyClass: 'A+' }
    },
    {
      title: 'Attico Trastevere',
      description: 'Caratteristico attico nel cuore di Roma con ampio terrazzo vivibile.',
      price: 3200,
      address: 'Vicolo del Cinque, Roma',
      type: 'attico',
      category: 'affitto',
      latitude: 41.8894, longitude: 12.4692,
      features: { roomCount: 2, area: 85, hasElevator: false, floor: 5, energyClass: 'G' }
    },
    {
      title: 'Villa Unifamiliare con Piscina',
      description: 'Splendida villa moderna immersa nel verde con giardino privato di 1000mq.',
      price: 1250000,
      address: 'Via dei Colli 42, Forte dei Marmi',
      type: 'villa',
      category: 'vendita',
      latitude: 43.9592, longitude: 10.1747,
      features: { roomCount: 6, area: 280, hasElevator: false, floor: 0, energyClass: 'A3' }
    },
    {
      title: 'Loft Industriale Isola',
      description: 'Open space di design ricavato da un ex laboratorio tessile, soffitti alti 5 metri.',
      price: 640000,
      address: 'Via Gaetano de Castillia, Milano',
      type: 'loft',
      category: 'vendita',
      latitude: 45.4862, longitude: 9.1904,
      features: { roomCount: 2, area: 120, hasElevator: true, floor: 1, energyClass: 'B' }
    },
    {
      title: 'Bilocale Moderno Cit Turin',
      description: 'Appartamento appena arredato comodo alla stazione Porta Susa e metro.',
      price: 950,
      address: 'Corso Francia 22, Torino',
      type: 'appartamento',
      category: 'affitto',
      latitude: 45.0761, longitude: 7.6652,
      features: { roomCount: 2, area: 65, hasElevator: true, floor: 3, energyClass: 'C' }
    },
    {
      title: 'Rustico Toscano Ristrutturato',
      description: 'Casale in pietra con travi a vista e vista sulle colline del Chianti.',
      price: 480000,
      address: 'Strada Provinciale 3, Gaiole in Chianti',
      type: 'rustico',
      category: 'vendita',
      latitude: 43.4681, longitude: 11.4339,
      features: { roomCount: 5, area: 190, hasElevator: false, floor: 0, energyClass: 'D' }
    },
    {
      title: 'Appartamento Fronte Mare',
      description: 'Accesso diretto alla spiaggia, ideale come casa vacanze o investimento.',
      price: 320000,
      address: 'Via Lungomare 112, Rimini',
      type: 'appartamento',
      category: 'vendita',
      latitude: 44.0628, longitude: 12.5808,
      features: { roomCount: 3, area: 75, hasElevator: true, floor: 2, energyClass: 'E' }
    },
    {
      title: 'Palazzetto Storico Centro',
      description: 'Intero stabile cielo-terra nel centro storico con corte interna.',
      price: 2100000,
      address: 'Via dell Indipendenza 5, Bologna',
      type: 'stabile',
      category: 'vendita',
      latitude: 44.4989, longitude: 11.3435,
      features: { roomCount: 12, area: 450, hasElevator: true, floor: 0, energyClass: 'G' }
    },
    {
      title: 'Appartamento Design Vomero',
      description: 'Ristrutturazione minimalista, molto luminoso con doppia esposizione.',
      price: 520000,
      address: 'Via Scarlatti, Napoli',
      type: 'appartamento',
      category: 'vendita',
      latitude: 40.8437, longitude: 14.2323,
      features: { roomCount: 4, area: 130, hasElevator: true, floor: 6, energyClass: 'B' }
    },
    {
      title: 'Monolocale Universitario',
      description: 'Piccolo appartamento funzionale a pochi passi dalla facoltà di economia.',
      price: 650,
      address: 'Via Valotti 3, Brescia',
      type: 'monolocale',
      category: 'affitto',
      latitude: 45.5621, longitude: 10.2312,
      features: { roomCount: 1, area: 35, hasElevator: true, floor: 2, energyClass: 'F' }
    },
    {
      title: 'Villetta a Schiera con Giardino',
      description: 'Contesto residenziale tranquillo, box auto doppio e taverna.',
      price: 275000,
      address: 'Via Leopardi 8, Treviso',
      type: 'villa',
      category: 'vendita',
      latitude: 45.6669, longitude: 12.2431,
      features: { roomCount: 4, area: 155, hasElevator: false, floor: 0, energyClass: 'C' }
    },
    {
      title: 'Appartamento di Lusso San Marco',
      description: 'Rifiniture classiche veneziane, pavimenti in seminato e soffitti decorati.',
      price: 1350000,
      address: 'Calle Larga XXII Marzo, Venezia',
      type: 'appartamento',
      category: 'vendita',
      latitude: 45.4335, longitude: 12.3364,
      features: { roomCount: 5, area: 170, hasElevator: false, floor: 1, energyClass: 'E' }
    },
    {
      title: 'Attico Moderno Bari City',
      description: 'Costruzione recente con domotica e ampio balcone perimetrale.',
      price: 1800,
      address: 'Corso Vittorio Emanuele, Bari',
      type: 'attico',
      category: 'affitto',
      latitude: 41.1257, longitude: 16.8667,
      features: { roomCount: 3, area: 105, hasElevator: true, floor: 7, energyClass: 'A2' }
    },
    {
      title: 'Casa Indipendente vista Etna',
      description: 'Ampia proprietà circondata da agrumeto e splendida vista sul vulcano.',
      price: 215000,
      address: 'Via Garibaldi, Nicolosi',
      type: 'casa',
      category: 'vendita',
      latitude: 37.6146, longitude: 15.0219,
      features: { roomCount: 4, area: 140, hasElevator: false, floor: 0, energyClass: 'F' }
    },
    {
      title: 'Elegante Quadrilocale Prati',
      description: 'Signorile stabile d epoca con servizio di portineria intera giornata.',
      price: 980000,
      address: 'Via Cola di Rienzo, Roma',
      type: 'appartamento',
      category: 'vendita',
      latitude: 41.9085, longitude: 12.4641,
      features: { roomCount: 4, area: 160, hasElevator: true, floor: 3, energyClass: 'D' }
    },
    {
      title: 'Chalet di Montagna',
      description: 'Struttura in legno e pietra a pochi minuti dagli impianti sciistici.',
      price: 390000,
      address: 'Strada Larzey-Entreves, Courmayeur',
      type: 'chalet',
      category: 'vendita',
      latitude: 45.7968, longitude: 6.9664,
      features: { roomCount: 3, area: 95, hasElevator: false, floor: 0, energyClass: 'B' }
    },
    {
      title: 'Appartamento Moderno Portello',
      description: 'Soggiorno living, cucina a vista e camera matrimoniale con cabina armadio.',
      price: 1400,
      address: 'Via Grosotto 7, Milano',
      type: 'appartamento',
      category: 'affitto',
      latitude: 45.4897, longitude: 9.1456,
      features: { roomCount: 2, area: 78, hasElevator: true, floor: 10, energyClass: 'A' }
    },
    {
      title: 'Attico Panoramico Genova',
      description: 'Vista mare a 180 gradi su tutto il porto antico e la Lanterna.',
      price: 580000,
      address: 'Corso Magellano, Genova',
      type: 'attico',
      category: 'vendita',
      latitude: 44.4071, longitude: 8.9340,
      features: { roomCount: 5, area: 145, hasElevator: true, floor: 8, energyClass: 'C' }
    },
    {
      title: 'Trilocale Borgo Vecchio',
      description: 'Appartamento caratteristico ristrutturato rispettando lo stile originale.',
      price: 185000,
      address: 'Via Maqueda, Palermo',
      type: 'appartamento',
      category: 'vendita',
      latitude: 38.1157, longitude: 13.3614,
      features: { roomCount: 3, area: 88, hasElevator: false, floor: 2, energyClass: 'G' }
    },
    {
      title: 'Villa Unifamiliare Olbia',
      description: 'Villa di testa in complesso residenziale esclusivo vicino a Porto Rotondo.',
      price: 740000,
      address: 'Località Rudalza, Olbia',
      type: 'villa',
      category: 'vendita',
      latitude: 41.0189, longitude: 9.5312,
      features: { roomCount: 4, area: 165, hasElevator: false, floor: 0, energyClass: 'B' }
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
      ...propData.features
    });

    await Images.create({
      url: `https://picsum.photos/seed/${property.id}/800/600`,
      order: 0,
      propertyId: property.id
    });
  }
}

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

export async function setDataTest() {
  try {
    console.log('Starting data initialization...');

    await database.sync({ force: true });

    const hashedPassword = await bcrypt.hash('agentpassword', 10);

    const { agent, alice } = await createAgencyAndUsers(hashedPassword);
    await createPropertiesForAgent(agent.id);
    await createExtras(agent.id);

    await Notifications.create({
      type: 'property',
      message: 'Un nuovo appartamento moderno è stato aggiunto in Cityville! Corrisponde alle ultime tue ricerche in "Centro".',
      userId: alice.id
    });

    await Notifications.create({
      type: 'promo',
      message: 'Super Offerta: Solo per questa settimana, consulenza mutui gratuita presso la nostra agenzia Best Estates!',
      userId: alice.id
    });

    console.log('Test data initialized successfully.');
  } catch (error) {
    console.error('Error initializing test data:', error);
    throw error;
  }
}