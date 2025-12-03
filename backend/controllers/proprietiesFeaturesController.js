import { ProprietiesFeatures } from "../models/database.js";

export class proprietiesFeaturesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createProprietyFeatures(req, res) {

        return ProprietiesFeatures.create({
            id: req.body.id,
            roomCount: req.body.roomCount,
            area: req.body.area,
            hasElevator: req.body.hasElevator,
            floor: req.body.floor,
            energyClass: req.body.energyClass,
        });
    }

    static async deleteProprietyFeatures(req, res) {

        return ProprietiesFeatures.destroy({where: {id : req.params.id} });
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
        return ProprietiesFeatures.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}