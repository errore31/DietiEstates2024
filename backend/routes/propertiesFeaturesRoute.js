import express from 'express';
import { proprietiesFeaturesController } from '../controllers/propertiesFeaturesController.js'
import { validationCreatePropertiesFeatures, validationUpdatePropertiesFeatures } from '../middleware/validation/validationPropertiesFeatures.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { enforceAuthentication } from '../middleware/authorization.js';
import { ensureIsAgent } from '../middleware/authorization.js';
import { ensureAgentOwnsProperty } from '../middleware/authorization.js';

export const proprietiesFeaturesRouter = express.Router();

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/

proprietiesFeaturesRouter.post('/create', enforceAuthentication, ensureIsAgent, validationCreatePropertiesFeatures, errorValidation, async (req, res, next) => {

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


proprietiesFeaturesRouter.put('/update/:id', enforceAuthentication, ensureAgentOwnsProperty, validationUpdatePropertiesFeatures, errorValidation, async (req, res, next) => {

    try {
        const idPropertyFeature = req.params.id;
        const featureUpdate = await proprietiesFeaturesController.updateProprietyFeatures(idPropertyFeature, req);

        res.status(200).json({ message: "Caratteristiche proprietà aggiornate con successo!", data: featureUpdate });

    } catch (error) {
        next(error);
    }

});
