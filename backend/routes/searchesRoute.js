import express from 'express';
import { searchesController } from '../controllers/searchesController.js';
import { enforceAuthentication } from '../middleware/authorization.js';

export const searchesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
searchesRouter.post('/', async (req, res, next) => {

    try {
        const search = await searchesController.createSearch(req, res);
        res.status(201).json({
            message: "Ricerca effettuata con successo",
            search: { id: search.id, criteria: search.criteria, userId: search.userId}
        });
    } catch (error) {
        next(error);
    }

});

searchesRouter.delete('/delete/:id', enforceAuthentication, async (req, res, next) => {
    try {
        const idSearch = req.params.id;
        await searchesController.deleteSearch(idSearch);
        res.status(200).json({
            message: "Ricerca eliminata con successo!",
            search: {}
        });
    } catch (error) {
        next(error);
    }
});