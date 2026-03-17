import express from 'express';
import { RequestAgencyController } from '../controllers/requestAgencyController.js';
import { enforceAuthentication, ensureIsAdmin } from '../middleware/authorization.js';
import { validationCreateRequestAgency } from '../middleware/validation/validationRequestAgency.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';

export const requestAgencyRouter = express.Router();

/**
 * POST /request-agency/
 * Invia una nuova richiesta di creazione agenzia (accessibile a tutti).
 */
requestAgencyRouter.post('/', validationCreateRequestAgency, errorValidation, async (req, res, next) => {
    try {
        const request = await RequestAgencyController.createRequest(req);
        res.status(201).json({
            message: "Richiesta inviata con successo! Verrai contattato a breve.",
            request: { id: request.id }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /request-agency/
 * Restituisce tutte le richieste pendenti (solo admin di sistema).
 */
requestAgencyRouter.get('/', enforceAuthentication, ensureIsAdmin, async (req, res, next) => {
    try {
        const requests = await RequestAgencyController.getAllRequests();
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /request-agency/:id/approve
 * Approva la richiesta: crea agenzia + agencyAdmin ed elimina la richiesta (solo admin di sistema).
 */
requestAgencyRouter.post('/:id/approve', enforceAuthentication, ensureIsAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        const { agency, agencyAdmin } = await RequestAgencyController.approveRequest(id);
        res.status(201).json({
            message: "Richiesta approvata! Agenzia e amministratore creati con successo.",
            agency: { id: agency.id, businessName: agency.businessName },
            agencyAdmin: { id: agencyAdmin.id, username: agencyAdmin.username }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /request-agency/:id/reject
 * Rifiuta la richiesta: elimina la richiesta pendente (solo admin di sistema).
 */
requestAgencyRouter.delete('/:id/reject', enforceAuthentication, ensureIsAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        await RequestAgencyController.rejectRequest(id);
        res.status(200).json({
            message: "Richiesta rifiutata ed eliminata con successo."
        });
    } catch (error) {
        next(error);
    }
});
