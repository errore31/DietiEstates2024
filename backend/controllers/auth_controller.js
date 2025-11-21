import { Utenti } from "../models/database.js";
import bcrypt from "bcrypt";

export class authController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async verificaCredenziali(req, res) {
        const utente = await Utenti.findOne({ where: { username: req.body.username } });
        
        if (!utente) return null;

        const confronto = await bcrypt.compare(req.body.password, utente.password);
        
        return confronto ? utente : null;
    }

}