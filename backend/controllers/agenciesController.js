import { Agencies, Properties, Users, Images, PropertiesFeatures } from "../models/database.js";

export class agenciesController {
    /**
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    **/
    static async createAgency(req, res) {

        return Agencies.create({
            businessName: req.body.businessName,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
        });
    }

    static async deleteAgency(idAgency) {
        const agency = await Agencies.findByPk(idAgency);
        if (!agency) {
            throw new customError('Agenzia non trovata', 404);
        }

        await agency.destroy();
        return true;
    }

    static async updateAgency(idAgency, req) {
        const agency = await Agencies.findByPk(idAgency);
        if (!agency) {
            throw new customError('Agenzia non trovata', 404);
        }

        const allowedUpdates = ['businessName', 'name', 'address', 'phone', 'email'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                agency[field] = req.body[field];
            }
        });

        await agency.save();

        return agency;
    }

    static async getAgencyById(idAgency) {
        try {
            const agency = await Agencies.findByPk(idAgency, {
                include: [
                    { model: Users }
                ],
            });
            return agency;
        } catch (error) {
            throw error;
        }
    }

}
