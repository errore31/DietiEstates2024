import express from 'express';
import { proprietiesController } from '../controllers/proprietiesController'

export const proprietiesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
proprietiesRouter.post('/create', async (req, res, next) => {

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

proprietiesRouter.post('/delete', async (req, res, next) => {

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



proprietiesRouter.post('/update', async (req, res, next) => {

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
