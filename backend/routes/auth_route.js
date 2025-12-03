import express from 'express';
import { authController } from '../controllers/auth_controller.js';
import { utentiController } from '../controllers/utenti_controller.js';
import { validationSignup, validationLogin } from '../middleware/validation/validationAuth.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';

export const authRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
authRouter.post('/', validationLogin, errorValidation, async (req, res, next) => {

    try {
        const utente = await authController.verificaCredenziali(req, res);

        if (utente) {
            req.session.utenteId = utente.id;
            req.session.username = utente.username;
            req.session.role = utente.role;
            req.session.auth = true;
            res.status(200).json({
                message: "Login effettuato con successo",
                utente: { id: utente.id, username: utente.username, ruolo: utente.ruolo, idAg: utente.agencyId }
            });
        } else {
            res.status(401).json({ error: "Credenziali non valide. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
authRouter.post('/signup', validationSignup, errorValidation, async (req, res, next) =>{

    try{
        const utente = await utentiController.salvaUtente(req, res);

        res.status(201).json({
            message: "Utente salvato con successo",
            utente: {id: utente.id, username: utente.username, role: utente.role}
        });

    } catch (error){
        next(error);
    }

});
