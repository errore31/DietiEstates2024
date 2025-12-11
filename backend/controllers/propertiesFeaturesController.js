import { PropertiesFeatures } from "../models/database.js";

export class proprietiesFeaturesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createProprietyFeatures(req, res) {

        return PropertiesFeatures.create({
            id: req.body.id,
            roomCount: req.body.roomCount,
            area: req.body.area,
            hasElevator: req.body.hasElevator,
            floor: req.body.floor,
            energyClass: req.body.energyClass,
        });
    }

    static async updateProprietyFeatures(idPropertyFeature ,req) {
        const propertyFeatures = await PropertiesFeatures.findByPk(idPropertyFeature);
        if (!propertyFeatures) {
            throw new customError('Caratteristiche non trovate non trovato', 404); 
        }
        
        const allowedUpdates = ['roomCount', 'area', 'hasElevator', 'floor', 'energyClass'];
        
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                propertyFeatures[field] = req.body[field];
            }
        });
        
        await propertyFeatures.save();
                
        return propertyFeatures;
    }

    

}