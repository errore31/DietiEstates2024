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

    static async deleteProprietyFeatures(req, res) {

        return PropertiesFeatures.destroy({where: {id : req.params.id} });
    }

    static async updateProprietyFeatures(req, res) {
        const updateData = {
            id: req.body.id,
            roomCount: req.body.roomCount,
            area: req.body.area,
            hasElevator: req.body.hasElevator,
            floor: req.body.floor,
            energyClass: req.body.energyClass,
        };
        return PropertiesFeatures.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}