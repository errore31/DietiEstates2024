import express from 'express';
import { agenciesController } from '../controllers/agenciesController.js'

export const agenciesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 

agenciesRouter.post('/create', async (req, res, next) => {

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