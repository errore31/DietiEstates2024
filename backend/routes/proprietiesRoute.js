import express from 'express';
import { proprietiesController } from '../controllers/proprietiesController'
import { enforceAuthentication } from '../middleware/authorization';
import { ensureIsAgent } from '../middleware/authorization';
import { ensureAgentOwnsProperty } from '../middleware/authorization';

export const proprietiesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
proprietiesRouter.post('/create', enforceAuthentication,  ensureIsAgent, async (req, res, next) => {

    try {
        //const utente = await authController.verificaCredenziali(req, res);
        const propriety = req.body;
        if (propriety) {
            proprietiesController.createProprieties(propriety);

            res.status(201).json({
                message: "Proprietà aggiunta con successo!",
                propriety: { }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

proprietiesRouter.post('/delete', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const propriety = req.body;
        if (propriety) {
            proprietiesController.deleteProprieties(propriety);

            res.status(204).json({
                message: "Proprietà eliminata con successo!",
                propriety: { }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});



proprietiesRouter.post('/update', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const propriety = req.body;
        if (propriety) {
            proprietiesController.updateProprieties(propriety);

            res.status(204).json({
                message: "Proprietà eliminata con successo!",
                propriety: { }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});
