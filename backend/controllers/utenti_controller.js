import { Utenti } from "../models/database";
import bcrypt from "bcrypt";

export class utentiController {

    /**
    * Handles post requests on /auth/signup. Create a new user 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
    static async salvaUtente(req, res) {
        const hashed_password = await bcrypt.hash(req.body.password, 10); 

        return Utenti.create({
            username: req.body.username,
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