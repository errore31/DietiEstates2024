import { Agencies } from "../models/database.js";

export class agenciesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createAgency(req, res) {

        return Agencies.create({
            businessName: req.body.businessName,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
        });
    }

    static async deleteProprieties(req, res) {

        //return Proprieties.destroy({where: {id : req.params.id} });
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