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

    static async deleteAgency(req, res) {

        return Agencies.destroy({where: {id : req.params.id} });
    }

    static async updateAgency(req, res) {
        const updateData = {
            businessName: req.body.businessName,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
        };
        return Agencies.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}