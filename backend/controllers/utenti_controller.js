import { Utenti } from "../models/database.js";
import bcrypt from "bcrypt";

export class utentiController {

    /**
    * Handles post requests on /auth/signup. Create a new user 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
    static async salvaUtente(req, res) {
        console.log(req.body);
        const hashed_password = await bcrypt.hash(req.body.password, 10); 

        return Utenti.create({
            username: req.body.username,
            nome: req.body.nome,
            cognome: req.body.cognome,
            email: req.body.email,
            ruolo: req.body.ruolo, //PUNTO CRITICO: un hacker potrebbe creare un admin e prendersi il controllo del sistema
            id_agenzia: req.body.id_agenzia,
            password: hashed_password
        });
    }

      /**
     * Handles post requests on /auth/???. Check if the username exists
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    
    static async controlloUsername(req, res) {
        return Utenti.findAll({where: {username: req.body.username}});
    }


}