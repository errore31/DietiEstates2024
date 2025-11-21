import { Proprieties } from "../models/database";

export class ProprietiesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createProprieties(req, res) {

        return Proprieties.create({
            title: req.body.title,
            descrption: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.body.agentId,
            featuresId: featuresId
        });
    }

    static async deleteProprieties(req, res) {

        return Proprieties.destroy({where: {id : req.params.id} });
    }

    static async updateProprieties(req, res) {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.body.agentId,
            featuresId: req.body.featuresId,
        };
        return Proprieties.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}