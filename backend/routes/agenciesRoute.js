import express from 'express';
import { agenciesController } from '../controllers/agenciesController.js'
import { enforceAuthentication, ensureIsAgencyAdmin } from '../middleware/authorization.js';
import { validationCreateAgency, validationUpdateAgency } from '../middleware/validation/validationAgencies.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { propertiesController } from '../controllers/propertiesController.js';

export const agenciesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 

agenciesRouter.post('/create', enforceAuthentication, ensureIsAgencyAdmin, validationCreateAgency, errorValidation,  async (req, res, next) => {

    try {
        const agency = await agenciesController.createAgency(req);
        if (agency) {
            res.status(201).json({
                message: "Agenzia aggiunta con successo!",
                agency: { id: agency.id }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

agenciesRouter.delete('/delete/:id', enforceAuthentication, ensureIsAgencyAdmin, async (req, res, next) => {

    try {
        const idAgency = req.params.id;
        await agenciesController.deleteAgency(idAgency);
        res.status(200).json({
            message: "Agenzia eliminata con successo!",
            agency: {}
        });
    } catch (error) {
        next(error);
    }
});

agenciesRouter.put('/update/:id', enforceAuthentication, ensureIsAgencyAdmin, validationUpdateAgency, errorValidation, async (req, res, next) => {
    try {
        const idAgency = req.params.id;
        const updatedAgency = await agenciesController.updateAgency(idAgency, req);
        res.status(200).json({
            message: "Agenzia aggiornata con successo!",
            agency: updatedAgency
        });
    } catch (error) {
        next(error);
    }
});

agenciesRouter.get('/:id', async (req, res, next) => {

    try{
        const idAgency = req.params.id;
        const agency = await agenciesController.getAgencyById(idAgency);
        res.send(agency);
    }catch (error){
        next(error);
    }
});

agenciesRouter.get('/:id/properties', async (req, res, next) => {
    try{
        const agencyId = req.params.id;
        const properties = await propertiesController.getPropertiesByAgencyId(agencyId);
        res.send(properties);
    }catch (error){
        next(error);
    }
});