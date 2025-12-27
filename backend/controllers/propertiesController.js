import fs from "fs";

import { Properties } from "../models/database.js";
import { imagesController } from "./imagesController.js";



export class propertiesController {


    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/

    static async createPropertyWithImage(req) {
        try {
            //create a property first
            const property = await this.createProperty(req);

            if (!property) {
                throw new customError('Errore nella creazione della proprietà', 500);
            }

            //insert images linked to the property
            if (req.files && req.files.length > 0) {
                await imagesController.createImages(property.id, req.files);
            } else {
                throw new customError('Almeno una immagine è richiesta per la proprietà', 400);
            }

            return property;

        } catch (error) { //delete uploaded files in case of error
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //da capire meglio
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

}