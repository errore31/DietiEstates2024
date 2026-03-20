import { validationResult } from "express-validator";
import fs from 'fs';

export function errorValidation(req, res, next) {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Errore eliminazione file orfano:", err);
                    else console.log("File orfano eliminato per errore validazione:", file.path);
                });
            });
        }

        return res.status(400).json({
            message: "Errore nella validazione degli input",
            error: validation.array()
        })
    }

    next();
} 