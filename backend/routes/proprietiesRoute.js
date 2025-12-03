import express from 'express';
import { proprietiesController } from '../controllers/proprietiesController.js'
import { enforceAuthentication } from '../middleware/authorization.js';
import { ensureIsAgent } from '../middleware/authorization.js';
import { ensureAgentOwnsProperty } from '../middleware/authorization.js';

export const proprietiesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 

proprietiesRouter.post('/create', async (req, res, next) => {

    try {
        //const utente = await authController.verificaCredenziali(req, res);
        const propriety = await proprietiesController.createPropriety(req);
        if (propriety) {
            
            res.status(201).json({
                message: "Proprietà aggiunta con successo!",
                propriety: { id : propriety.id }
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
            proprietiesController.deletePropriety(propriety);

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



proprietiesRouter.put('/update', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const propriety = req.body;
        if (propriety) {
            proprietiesController.updatePropriety(propriety);

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
