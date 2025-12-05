import express from 'express';
import { proprietiesFeaturesController } from '../controllers/proprietiesFeaturesController.js'
import { validationCreateProprietyFeatures, validationUpdatePropertiesFeatures } from '../middleware/validation/validationProprietiesFeatures.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { enforceAuthentication } from '../middleware/authorization.js';
import { ensureIsAgent } from '../middleware/authorization.js';
import { ensureAgentOwnsProperty } from '../middleware/authorization.js';

export const proprietiesFeaturesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 

proprietiesFeaturesRouter.post('/create', enforceAuthentication, ensureIsAgent, validationCreateProprietyFeatures, errorValidation, async (req, res, next) => {

    try {
        const proprietyFeatures = await proprietiesFeaturesController.createProprietyFeatures(req);
        if (proprietyFeatures) {
            res.status(201).json({
                message: "Caratteristiche della proprietà aggiunte con successo!",
                proprietyFeatures: { id: proprietyFeatures.id }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});