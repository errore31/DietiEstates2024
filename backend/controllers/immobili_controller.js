import { Immobili } from "../models/database";
import bcrypt from "bcrypt";

export class ImmobiliController {
    
    
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/


    static async salvaUtente(req, res) {
        const hashed_password = await bcrypt.hash(req.body.password, 10); 

        return Utenti.create({
            username: req.body.username,
            password: hashed_password
        });
    }


}