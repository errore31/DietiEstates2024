import fs from "fs";

import { Properties, PropertiesFeatures, Images, Users, Searches, Notifications } from "../models/database.js";
import { imagesController } from "./imagesController.js";
import { Op } from 'sequelize';


export class propertiesController {



    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/

    static async createPropertyWithImage(req) {
        let property = null;
        try {

            if (!req.files || req.files.length === 0) {
                const error = new Error('Almeno una immagine è richiesta');
                error.status = 400;
                throw error;
            }

            property = await this.createProperty(req);

            await imagesController.createImages(property.id, req.files);

            return property;

        } catch (error) { //delete uploaded files in case of error (server/db error)
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //da capire meglio
            if (property) {
                await this.deleteProperty(property.id);
            }

            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('Errore eliminazione file:', file.path);
                    });
                });
            }
            throw error;
        }
    }

    static async createProperty(req) {

        let featuresData = req.body.PropertiesFeature;
        if (typeof featuresData === 'string') {
            featuresData = JSON.parse(featuresData);
        }

        // Creiamo la proprietà nel database
        const newProperty = await Properties.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            category: req.body.category,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.session.userId
        });

        if (featuresData) {
            await PropertiesFeatures.create({
                id: newProperty.id,
                roomCount: featuresData.roomCount,
                area: featuresData.area,
                hasElevator: featuresData.hasElevator,
                floor: featuresData.floor,
                energyClass: featuresData.energyClass
            });
        }

        // TRIGGER NOTIFICHE: Controlla se il nuovo immobile corrisponde a recenti ricerche
        try {
            const propertyAddress = newProperty.address ? newProperty.address.toLowerCase() : '';
            const propertyTitle = newProperty.title ? newProperty.title.toLowerCase() : '';
            
            // Trova tutte le ricerche salvate
            const recentSearches = await Searches.findAll({
                order: [['createdAt', 'DESC']]
            });

            // Group by userId e prendi solo le ultime 3 ricerche per utente
            const userRecentSearches = {};
            for (const search of recentSearches) {
                if (!userRecentSearches[search.userId]) {
                    userRecentSearches[search.userId] = [];
                }
                if (userRecentSearches[search.userId].length < 3) {
                    userRecentSearches[search.userId].push(search);
                }
            }

            // Controlla il match e crea le notifiche
            const usersToNotify = new Set();
            for (const userId in userRecentSearches) {
                const searches = userRecentSearches[userId];
                for (const search of searches) {
                     // Check se i criteri della ricerca testuale matchano la keyword
                    const searchTitle = search.criteria && (search.criteria['area/title'] || search.criteria.text);
                    if (searchTitle) {
                        // Prendi solo la prima parte della stringa di ricerca (es: da "Napoli, NA, Italia" prendi "napoli")
                        const searchTerm = searchTitle.split(',')[0].trim().toLowerCase();
                        
                        // Controlla se l'indirizzo o il titolo dell'immobile contengono il termine cercato
                        if (propertyAddress.includes(searchTerm) || propertyTitle.includes(searchTerm)) {
                            usersToNotify.add(userId);
                            break; // Basta una ricerca matchata per notificare l'utente
                        }
                    }
                }
            }

            // Crea le notifiche in blocco
            const notificationPromises = Array.from(usersToNotify).map(userId => {
                return Notifications.create({
                    type: 'property',
                    message: `Un nuovo immobile in "${newProperty.address}" è appena stato aggiunto e corrisponde alle tue ultime ricerche!`,
                    userId: userId
                });
            });

            await Promise.all(notificationPromises);
        } catch (error) {
             console.error('Errore durante la generazione delle notifiche automatiche:', error);
             // Non bloccare la creazione della proprietà se le notifiche falliscono
        }

        return newProperty;
    }


    static async deleteProperty(idPropriety) {
        const property = await Properties.findByPk(idPropriety);
        if (!property) {
            throw new customError('Immobile non trovato', 404);
        }

        await property.destroy();
        return true;
    }

    static async updateProperty(idPropriety, req) {

        const property = await Properties.findByPk(idPropriety);
        if (!property) {
            throw new customError('Immobile non trovato', 404);
        }

        const allowedUpdates = ['title', 'description', 'price', 'address', 'type', 'category', 'latitude', 'longitude'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        await property.save();

        return property;
    }

    static async updatePropertyFull(idPropriety, req) {
        const property = await Properties.findByPk(idPropriety);
        if (!property) {
            const error = new Error('Immobile non trovato');
            error.status = 404;
            throw error;
        }

        const allowedUpdates = ['title', 'description', 'price', 'address', 'type', 'category', 'latitude', 'longitude'];
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });
        await property.save();

        let featuresData = req.body.PropertiesFeature;
        if (featuresData) {
            if (typeof featuresData === 'string') {
                featuresData = JSON.parse(featuresData);
            }
            const propertyFeatures = await PropertiesFeatures.findByPk(idPropriety);
            if (propertyFeatures) {
                const allowedFeatures = ['roomCount', 'area', 'hasElevator', 'floor', 'energyClass'];
                allowedFeatures.forEach((field) => {
                    if (featuresData[field] !== undefined) {
                        propertyFeatures[field] = featuresData[field];
                    }
                });
                await propertyFeatures.save();
            } else {
                await PropertiesFeatures.create({
                    id: idPropriety,
                    roomCount: featuresData.roomCount,
                    area: featuresData.area,
                    hasElevator: featuresData.hasElevator,
                    floor: featuresData.floor,
                    energyClass: featuresData.energyClass
                });
            }
        }

        if (req.files && req.files.length > 0) {
            await imagesController.createImages(idPropriety, req.files);
        }

        return property;
    }

    static async getPropertyById(propertyId, req, res) {
        return Properties.findOne({
            where: { id: propertyId },
            include: [
                {
                    model: PropertiesFeatures,
                },
                {
                    model: Images
                }
            ]
        });
    }


    static async getSearchedProperties(propertyText, req, res) {
        try {
            const searchText = propertyText.trim();
            const properties = await Properties.findAll({
                where: {
                    [Op.or]: [
                        { address: { [Op.iLike]: `%${searchText}%` } },
                        { title: { [Op.iLike]: `%${searchText}%` } },
                        { description: { [Op.iLike]: `%${searchText}%` } }
                    ]
                },
                include: [
                    {
                        model: PropertiesFeatures,
                    },
                    {
                        model: Images
                    }
                ]
            });
            return properties;
        } catch (error) {
            console.error("Errore nel recupero proprietà:", error);
            throw error;
        }
    }



    static async getAdvancedSearchedProperties(req) {
        try {
            const { text, type, maxPrice, roomCount, area, floor, energyClass, hasElevator } = req.query;

            const propertyWhere = {};
            if (text) {
                propertyWhere[Op.or] = [
                    { address: { [Op.iLike]: `%${text}%` } },
                    { title: { [Op.iLike]: `%${text}%` } },
                    { description: { [Op.iLike]: `%${text}%` } }
                ];
            }
            if (type) {
                propertyWhere.type = type;
            }
            if (maxPrice) {
                propertyWhere.price = { [Op.lte]: parseFloat(maxPrice) };
            }

            const featuresWhere = {};
            if (roomCount) {
                featuresWhere.roomCount = { [Op.gte]: parseInt(roomCount) };
            }
            if (area) {
                featuresWhere.area = { [Op.gte]: parseInt(area) };
            }
            if (floor) {
                featuresWhere.floor = parseInt(floor);
            }
            if (energyClass) {
                featuresWhere.energyClass = energyClass;
            }
            if (hasElevator === 'true') {
                featuresWhere.hasElevator = true;
            }

            const properties = await Properties.findAll({
                where: propertyWhere,
                include: [
                    {
                        model: PropertiesFeatures,
                        where: Object.keys(featuresWhere).length > 0 ? featuresWhere : undefined,
                        required: Object.keys(featuresWhere).length > 0
                    },
                    {
                        model: Images
                    }
                ],
                order: [
                    ['createdAt', 'DESC'],
                    [Images, 'order', 'ASC']
                ]
            });

            return properties;
        } catch (error) {
            console.error("Errore nel recupero proprietà (advanced search):", error);
            throw error;
        }
    }

    static async getAllProperty(req) {
        try {
            const properties = await Properties.findAll({
                include: [
                    { model: Images },
                    { model: PropertiesFeatures }
                ],
                // ordina per data di creazione per avere le più recenti
                order: [
                    ['createdAt', 'DESC'],
                    [Images, 'order', 'ASC']
                ]
            });

            return properties;
        } catch (error) {
            console.error("Errore nel recupero proprietà:", error);
            throw error;
        }
    }

    static async getPropertiesByAgencyId(agencyId) {

        try {
            const properties = await Properties.findAll({
                include: [
                    { model: Images },
                    { model: PropertiesFeatures },
                    {
                        model: Users,
                        where: { agencyId: agencyId }, //Mi prendo gli immobili degli utenti associati all'agenzia
                        attributes: []
                    }
                ]
            });
            return properties;
        } catch (error) {
            console.error("Errore nel recupero delle proprietà:", error);
            throw error;
        }
    }

}