import { Users } from "../models/database.js";
import bcrypt from "bcrypt";

export class authController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async checkCredential(req, res) {
        const user = await Users.findOne({ where: { username: req.body.username } });
        
        if (!user) return null;

        const comparison = await bcrypt.compare(req.body.password, user.password);
        
        return comparison ? user : null;
    }

}