import fs from "fs";
import { Properties, PropertiesFeatures, Images, Users, Searches, Notifications, Agencies } from "../models/database.js";
import { imagesController } from "./imagesController.js";
import { Op } from 'sequelize';
import { geoapifyGeocode } from '../services/GeoapifyAPI.js';

export class propertiesController {

    static getUsersToNotify(propertyAddress, propertyTitle, recentSearches) {
        const address = propertyAddress ? propertyAddress.toLowerCase() : '';
        const title = propertyTitle ? propertyTitle.toLowerCase() : '';

        const userRecentSearches = {};
        for (const search of recentSearches) {
            if (!userRecentSearches[search.userId]) {
                userRecentSearches[search.userId] = [];
            }
            if (userRecentSearches[search.userId].length < 3) {
                userRecentSearches[search.userId].push(search);
            }
        }

        const usersToNotify = new Set();
        for (const userId in userRecentSearches) {
            const searches = userRecentSearches[userId];
            for (const search of searches) {
                const searchTitle = search.criteria && (search.criteria['area/title'] || search.criteria.text);
                if (searchTitle) {
                    const searchTerm = searchTitle.split(',')[0].trim().toLowerCase();

                    if (address.includes(searchTerm) || title.includes(searchTerm)) {
                        usersToNotify.add(parseInt(userId));
                        break;
                    }
                }
            }
        }

        return Array.from(usersToNotify);
    }


    static buildAdvancedSearchQuery(queryParams) {
        const { text, type, maxPrice, roomCount, area, floor, energyClass, hasElevator,
            bboxLon1, bboxLat1, bboxLon2, bboxLat2 } = queryParams;

        const propertyWhere = {};

        if (bboxLon1 && bboxLat1 && bboxLon2 && bboxLat2) {
            const minLat = Math.min(parseFloat(bboxLat1), parseFloat(bboxLat2));
            const maxLat = Math.max(parseFloat(bboxLat1), parseFloat(bboxLat2));
            const minLon = Math.min(parseFloat(bboxLon1), parseFloat(bboxLon2));
            const maxLon = Math.max(parseFloat(bboxLon1), parseFloat(bboxLon2));
            propertyWhere.latitude = { [Op.between]: [minLat, maxLat] };
            propertyWhere.longitude = { [Op.between]: [minLon, maxLon] };
        } else if (text) {
            const searchText = text.trim();
            propertyWhere[Op.or] = [
                { address: { [Op.iLike]: `%${searchText}%` } }
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

        return { propertyWhere, featuresWhere };
    }


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

        } catch (error) {
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

        try {

            const recentSearches = await Searches.findAll({
                order: [['createdAt', 'DESC']]
            });

            const usersToNotify = this.getUsersToNotify(newProperty.address, newProperty.title, recentSearches);

            const notificationPromises = usersToNotify.map(userId => {
                return Notifications.create({
                    type: 'property',
                    message: `Un nuovo immobile in "${newProperty.address}" è appena stato aggiunto e corrisponde alle tue ultime ricerche!`,
                    userId: userId
                });
            });

            await Promise.all(notificationPromises);
        } catch (error) {
            console.error('Errore durante la generazione delle notifiche automatiche:', error);
        }

        return newProperty;
    }

    static async deleteProperty(idPropriety) {
        const property = await Properties.findByPk(idPropriety);
        if (!property) {
            const error = new Error('Immobile non trovato');
            error.status = 404;
            throw error;
        }

        await property.destroy();
        return true;
    }

    static async updateProperty(idPropriety, req) {
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
                { model: PropertiesFeatures },
                { model: Images },
                {
                    model: Users,
                    include: [{ model: Agencies }]
                }
            ]
        });
    }

    static async getSearchedProperties(propertyText, req, res) {
        try {
            const { bboxLon1, bboxLat1, bboxLon2, bboxLat2 } = req.query || {};
            let whereClause = {};

            let effectiveBbox = null;

            if (bboxLon1 && bboxLat1 && bboxLon2 && bboxLat2) {
                effectiveBbox = {
                    lon1: parseFloat(bboxLon1), lat1: parseFloat(bboxLat1),
                    lon2: parseFloat(bboxLon2), lat2: parseFloat(bboxLat2)
                };
            } else if (propertyText && propertyText.trim()) {
                effectiveBbox = await geoapifyGeocode(propertyText.trim());
            }

            if (effectiveBbox) {
                const minLat = Math.min(effectiveBbox.lat1, effectiveBbox.lat2);
                const maxLat = Math.max(effectiveBbox.lat1, effectiveBbox.lat2);
                const minLon = Math.min(effectiveBbox.lon1, effectiveBbox.lon2);
                const maxLon = Math.max(effectiveBbox.lon1, effectiveBbox.lon2);
                whereClause = {
                    latitude: { [Op.between]: [minLat, maxLat] },
                    longitude: { [Op.between]: [minLon, maxLon] }
                };
            } else {
                const searchText = propertyText.trim();
                whereClause = {
                    [Op.or]: [
                        { address: { [Op.iLike]: `%${searchText}%` } },
                        { title: { [Op.iLike]: `%${searchText}%` } },
                        { description: { [Op.iLike]: `%${searchText}%` } }
                    ]
                };
            }

            const properties = await Properties.findAll({
                where: whereClause,
                include: [
                    { model: PropertiesFeatures },
                    { model: Images }
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
            let { propertyWhere, featuresWhere } = this.buildAdvancedSearchQuery(req.query);

            const hasBboxFilter = propertyWhere.latitude !== undefined;
            const { text } = req.query;

            if (!hasBboxFilter && text && text.trim()) {
                const bbox = await geoapifyGeocode(text.trim());
                if (bbox) {
                    const minLat = Math.min(bbox.lat1, bbox.lat2);
                    const maxLat = Math.max(bbox.lat1, bbox.lat2);
                    const minLon = Math.min(bbox.lon1, bbox.lon2);
                    const maxLon = Math.max(bbox.lon1, bbox.lon2);
                    delete propertyWhere[Op.or];
                    propertyWhere.latitude = { [Op.between]: [minLat, maxLat] };
                    propertyWhere.longitude = { [Op.between]: [minLon, maxLon] };
                }
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
                order: [
                    ['createdAt', 'DESC'],
                    [Images, 'order', 'ASC']
                ]
            });

            return properties;
        } catch (error) {
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
                        where: { agencyId: agencyId },
                        attributes: []
                    }
                ]
            });
            return properties;
        } catch (error) {
            throw error;
        }
    }

    static async createPromotion(propertyId, req, res) {
        try {
            const property = await Properties.findByPk(propertyId);
            if (!property) {
                const error = new Error('Immobile non trovato');
                error.status = 404;
                throw error;
            }

            const promotionText = req.body.promotionText;
            if (!promotionText || promotionText.trim() === '') {
                const error = new Error('Il testo della promozione è richiesto');
                error.status = 400;
                throw error;
            }


            const recentSearches = await Searches.findAll({
                order: [['createdAt', 'DESC']]
            });

            const usersToNotify = this.getUsersToNotify(property.address, property.title, recentSearches);

            const notificationPromises = usersToNotify.map(userId => {
                return Notifications.create({
                    type: 'promo',
                    title: `Promozione su ${property.title}`,
                    message: promotionText,
                    userId: userId
                });
            });

            await Promise.all(notificationPromises);
            return true;

        } catch (error) {
            throw error;
        }
    }
}