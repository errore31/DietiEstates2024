import { Searches } from "../models/database.js";

export class searchesController {
    /**
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
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */

    static async getSearches(req, res) {
        return await Searches.findAll({
            where: { userId: req.session.userId }
        });
    }

}