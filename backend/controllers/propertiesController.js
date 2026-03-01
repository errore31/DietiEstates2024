import fs from "fs";

import { Properties, PropertiesFeatures, Images, Users } from "../models/database.js";
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