import { Users, Agencies } from "../models/database.js";
import bcrypt from "bcrypt";

export class userController {

    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
    static async createUser(req, res) {
        try {
            const hashed_password = await bcrypt.hash(req.body.password, 10);

            const newUser = await Users.create({
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                role: req.body.role,
                agencyId: req.body.agencyId,
                password: hashed_password
            });

            return newUser;
        } catch (error) {

            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicate = Object.keys(error.fields);
                let message;

                if (duplicate.includes("username")) {
                    message = "Username già in uso";
                }
                else if (duplicate.includes("email")) {
                    message = "Email già in uso";
                }

                const customError = new Error(message);
                customError.status = 409;
                throw customError;
            }

            error.status = error.status || 500;
            throw error;
        }
    }

    static async deleteUser(idUser) {
        const user = await Users.findByPk(idUser);
        if (!user) {
            const error = new Error('Utente non trovato');
            error.status = 404;
            throw error;
        }

        await user.destroy();
        return true;
    }

    static async updateUser(idUser, req) {
        const user = await Users.findByPk(idUser);
        if (!user) {
            const error = new Error('Utente non trovato');
            error.status = 404;
            throw error;
        }


        const allowedUpdates = ['name', 'surname', 'username', 'email', 'role', 'agencyId'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== "") {
                user[field] = req.body[field];
            }
        });

        if (req.body.newPassword) {

            if (!req.body.oldPassword) {
                const error = new Error('Devi inserire la vecchia password per poterla cambiare');
                error.status = 400;
                throw error;
            }

            const isPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isPasswordValid) {
                const error = new Error('La vecchia password non è corretta');
                error.status = 400;
                throw error;
            }

            user.password = await bcrypt.hash(req.body.newPassword, 10);
        }

        await user.save();
        return user;
    }

    static async checkUsername(req, res) {
        return Users.findAll({ where: { username: req.body.username } });
    }


    /**
   * @param {http.IncomingMessage} req 
   * @param {http.ServerResponse} res 
   */

    static async getUser(req, res) {
        return Users.findAll({ where: { id: req.session.userId }, attributes: ['name', 'surname', 'username', 'email', 'role', 'createdAt', 'updatedAt'], include: [{ model: Agencies, as: 'Agency', attributes: ['name'], required: false }] });
    }

}