import { Searches } from "../models/database.js";

export class searchesController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async createSearch(req, res) {
        return Searches.create({
            criteria: req.body.criteria,
            userId: req.session.userId
        });
    }

    static async deleteSearch(req, res) {
        return Searches.destroy({where: {id : req.params.id} });
    }

}