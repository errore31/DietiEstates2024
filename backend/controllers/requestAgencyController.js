import { Agencies, Users, RequestAgencies } from "../models/database.js";
import bcrypt from "bcrypt";

export class RequestAgencyController {

    static async createRequest(req) {
        try {
            const newRequest = await RequestAgencies.create({
                businessName: req.body.businessName,
                agencyName: req.body.agencyName,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                username: req.body.username,
            });

            return newRequest;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicate = Object.keys(error.fields);
                let message;

                if (duplicate.some(f => f.includes('businessName'))) {
                    message = "Esiste già una richiesta con questo nome azienda";
                } else if (duplicate.some(f => f.includes('email'))) {
                    message = "Esiste già una richiesta con questa email";
                } else if (duplicate.some(f => f.includes('username'))) {
                    message = "Esiste già una richiesta con questo username";
                } else {
                    message = "Richiesta già presente con dati duplicati";
                }

                const customError = new Error(message);
                customError.status = 409;
                throw customError;
            }

            error.status = error.status || 500;
            throw error;
        }
    }


    static async getAllRequests() {
        return RequestAgencies.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    static async approveRequest(id) {
        const request = await RequestAgencies.findByPk(id);
        if (!request) {
            const error = new Error('Richiesta non trovata');
            error.status = 404;
            throw error;
        }

        
        const hashedPassword = await bcrypt.hash("admin", 10);

        try {
            // 1. Crea l'agenzia
            const agency = await Agencies.create({
                businessName: request.businessName,
                name: request.agencyName,
                address: request.address,
                phone: request.phone,
                email: request.email,
            });

            // 2. Crea l'utente agencyAdmin collegato all'agenzia
            const agencyAdmin = await Users.create({
                name: request.name,
                surname: request.surname,
                username: request.username,
                email: request.email,
                password: hashedPassword,
                role: 'agencyAdmin',
                agencyId: agency.id,
            });

            // 3. Elimina la richiesta pendente
            await request.destroy();

            return { agency, agencyAdmin };
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const customError = new Error('Impossibile approvare: agenzia o utente con dati duplicati già esistente');
                customError.status = 409;
                throw customError;
            }
            error.status = error.status || 500;
            throw error;
        }
    }

    /**
     * Rifiuta una richiesta: elimina la richiesta pendente (solo admin).
     * DELETE /request-agency/:id/reject
     * @param {number} id - ID della RequestAgency
     */
    static async rejectRequest(id) {
        const request = await RequestAgencies.findByPk(id);
        if (!request) {
            const error = new Error('Richiesta non trovata');
            error.status = 404;
            throw error;
        }

        await request.destroy();
        return true;
    }
}
