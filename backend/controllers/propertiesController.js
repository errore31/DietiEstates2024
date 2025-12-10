import { Properties } from "../models/database.js";

export class propertiesController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async createProperty(req, res) {
        console.log(req.body);
        return Properties.create({
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

    static async deleteProperty(idPropriety) {
        
        return Properties.destroy({where: {id : idPropriety} });
    }

    static async updateProperty(req, res) {
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
        return Properties.update(
            updateData,
            {where: {id : req.params.id} });
    }

    

}