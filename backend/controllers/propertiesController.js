import fs from "fs";

import { Properties, PropertiesFeatures, Images } from "../models/database.js";
import { imagesController } from "./imagesController.js";



export class propertiesController {


    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/

    static async createPropertyWithImage(req) {
        let property = null;
        try{

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
                if(property){
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

        return Properties.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.session.userId
        });
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

        const allowedUpdates = ['title', 'description', 'price', 'address', 'type', 'latitude', 'longitude'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        await property.save();

        return property;
    }

    static async getProperty(propertyId, req, res) {
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

    static async getAllProperty(req){
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

}