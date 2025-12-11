import express from 'express';
import { propertiesController } from '../controllers/propertiesController.js'
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
        const propriety = await propertiesController.createProperty(req);
        if (propriety) {

            res.status(201).json({
                message: "Proprietà aggiunta con successo!",
                propriety: { id: propriety.id }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

proprietiesRouter.delete('/delete/:id', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const idPropriety = req.params.id;
        await propertiesController.deleteProperty(idPropriety); 

        res.status(200).json({
            message: "Proprietà eliminata con successo!",
            propriety: {}
        });
    } catch (error) {
        next(error);
    }

});



proprietiesRouter.put('/update/:id', enforceAuthentication, ensureAgentOwnsProperty, validationUpdateProperties, errorValidation, async (req, res, next) => {

    try {
        const idPropriety = req.params.id;
        const updatedProperty = await propertiesController.updateProperty(idPropriety, req);
        res.status(200).json({
            message: "Proprietà aggiornata con successo!",
            data: updatedProperty 
        });
    } catch (error) {
        next(error);
    }

});
