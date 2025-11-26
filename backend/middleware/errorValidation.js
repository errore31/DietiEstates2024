import { validationResult } from "express-validator";

/**
 * This middleware checks whether all registration inputs are validated.
 * If not validated, it responds with an error
 */

export function errorHandler(req, res, next) {
    const validation = validationResult(req);

    if (validation.isEmpty()) {
       return res.status(400).json({
            message: "Errore nella validazione degli input",
            error: validation.array()
        })
    }

    next();
}