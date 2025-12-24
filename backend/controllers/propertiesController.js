import { Properties } from "../models/database.js";

export class propertiesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createProperty(req) {

        return Properties.create({
            title: req.body.title,
            descrption: req.body.description,
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