import express from 'express';
import { proprietiesController } from '../controllers/proprietiesController.js'
import { enforceAuthentication } from '../middleware/authorization.js';
import { ensureIsAgent } from '../middleware/authorization.js';
import { ensureAgentOwnsProperty } from '../middleware/authorization.js';
import { validationCreateProperties, validationUpdateProperties } from '../middleware/validation/validationProperties.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';

export const proprietiesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 

proprietiesRouter.post('/create', enforceAuthentication, ensureIsAgent, validationCreateProperties, errorValidation, async (req, res, next) => {

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

//PER CARUSO, NON SI METTE POST MA DELETE
proprietiesRouter.post('/delete', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const propriety = req.body;
        if (propriety) {
            await proprietiesController.deletePropriety(propriety);

            res.status(200).json({
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



proprietiesRouter.put('/update', enforceAuthentication, ensureAgentOwnsProperty, validationUpdateProperties, errorValidation, async (req, res, next) => {

    try {
        const propriety = req.body;
        if (propriety) {
           await proprietiesController.updatePropriety(propriety);

            res.status(200).json({
                message: "Proprietà aggiornata con successo!",
                propriety: { }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});
