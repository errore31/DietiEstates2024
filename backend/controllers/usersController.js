import { Users, Agencies } from "../models/database.js";
import bcrypt from "bcrypt";

export class userController {

    /**
    * Handles post requests on /auth/signup. Create a new user 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
    static async createUser(req, res) {
        console.log(req.body);
        const hashed_password = await bcrypt.hash(req.body.password, 10); 

        return Users.create({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            role: req.body.role,
            agencyId: req.body.agencyId,
            password: hashed_password
        });
    }

      /**
     * Handles post requests on /auth/???. Check if the username exists
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    
    static async checkUsername(req, res) {
        return Users.findAll({where: {username: req.body.username}});
    }
    

      /**
     * Handles post requests on /auth/user. Check if the username exists
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    
    static async getUser(req, res) {
        return Users.findAll({where: {id: req.session.userId}, attributes: ['name', 'surname', 'username', 'email', 'role', 'createdAt', 'updatedAt'], include: [{model: Agencies, as: 'Agency', attributes: ['name'], required: false}]});
    }

}