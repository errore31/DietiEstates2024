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

    static async deleteSearch(idSearch) {
        const search = await Searches.findByPk(idSearch);
        if (!search) {
             throw new customError('Ricerca non trovata', 404); 
        }

        await search.destroy();
        return true;
    }
    /**
     * Handles post requests on /auth/user. Check if the username exists
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    
    static async getSearches(req, res) {
       const results = await Searches.findAll({
            where: { userId: req.session.userId }
        });
        return res.json(results);
    }

}