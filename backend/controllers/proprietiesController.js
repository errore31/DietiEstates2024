import { Proprieties } from "../models/database.js";

export class proprietiesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createPropriety(req, res) {
        console.log(req.body);
        return Proprieties.create({
            title: req.body.title,
            descrption: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.body.agentId
        });
    }

    static async deletePropriety(req, res) {

        return Proprieties.destroy({where: {id : req.params.id} });
    }

    static async updatePropriety(req, res) {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            agentId: req.body.agentId
        };
        return Proprieties.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}