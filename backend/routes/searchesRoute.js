import express from 'express';
import { searchesController } from '../controllers/searchesController.js';
import { enforceAuthentication, ensureUserOwnsSearch } from '../middleware/authorization.js';
import { geoapifySuggestion } from '../services/GeoapifyAPI.js';

export const searchesRouter = express.Router();

/**
 * This route handles saving searches
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
searchesRouter.post('/', enforceAuthentication, async (req, res, next) => {

    try {
        const search = await searchesController.createSearch(req, res);
        res.status(201).json({
            message: "Ricerca effettuata con successo",
            search: { id: search.id, criteria: search.criteria, userId: search.userId }
        });
    } catch (error) {
        next(error);
    }

});

searchesRouter.delete('/delete/:id', enforceAuthentication, ensureUserOwnsSearch, async (req, res, next) => {
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

searchesRouter.get('/history', enforceAuthentication, async (req, res, next) => {

    try {
        const search = await searchesController.getSearches(req, res);
        res.send(search);
    } catch (error) {
        next(error);
    }

});


searchesRouter.get('/searchSuggestion/:text', async (req, res, next) => {
    try {
        const suggestions = await geoapifySuggestion(req.params.text);
        res.send(suggestions);
    } catch (error) {
        next(error);
    }
});

