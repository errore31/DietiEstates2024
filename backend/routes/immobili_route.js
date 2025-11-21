import express from 'express';
import { immoobiliController } from '../controllers/immobili_controller'

export const immobiliRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
immobiliRouter.post('/save', async (req, res, next) => {

    try {
        //const utente = await authController.verificaCredenziali(req, res);
        const immobile = req.body;
        if (immobile) {
            immobiliController.saveProprieties(immobile);
            immobiliController.saveProprieties(immobile);
            // req.session.utenteId = utente.id;
            // req.session.username = utente.username;
            // req.session.auth = true;
            //
            // res.status(200).json({
            //     message: "Login effettuato con successo",
            //     utente: { id: utente.id, username: utente.username }
            // });
        } else {
            res.status(401).json({ error: "Credenziali non valide. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});