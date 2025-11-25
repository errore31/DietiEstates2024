import { Proprieties } from "../models/database";

/**
 *  This middleware ensures that the user is currently authenticated and has the appropriate role.
 * If not, it responds with an error message.
 */

export function enforceAuthentication(req, res, next){
    if (req.session && req.session.auth) {
        req.user = {
            id: req.session.userId,
            username: req.session.username,
            role: req.session.role
        };
        next();
    } else {
        next({ status: 401, message: "Non autorizzato" });
    }
}

export async function ensureAgentOwnsProperty(req, res, next){
    try {
        const allowedRoles = ['agent', 'agency admin'];

        if (!allowedRoles.includes(req.user.role)) {
            return next({ status: 403, message: "Non hai i permessi per modifcare l'immobile" });
        }

        const propertyId = req.params.id;
        const property = await Proprieties.findByPk(propertyId);

        if (!property) {
           return next({ status: 404, message: "Immobile non trovato" });
        }

        if (property.agentId !== req.user.id) {
            return next({ status: 403, message: "Non hai il permesso per modificare l'immobile" });
        }

        next();
    } catch (err) {
        next(err);
    }
}

export function ensureIsAgent(req, res, next) {

    const allowedRoles = ['agent', 'agency admin'];

    if (!allowedRoles.includes(req.user.role)) {
        return next({ status: 403, message: "Non sei un agente immobiliare" });
    }
    next();
}

export function ensureIsAgencyAdmin(req, res, next) {
    if (req.user.role !== 'agency admin') {
        return next({ status: 403, message: "Non sei un amministratore di agenzia" });
    }
    next();
}