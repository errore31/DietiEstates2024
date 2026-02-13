import { body } from "express-validator";

export const validationUpdateUser = [
    body("username").optional().trim().notEmpty().withMessage("L'username non può essere vuoto.").escape(),
    body("name").optional().trim().notEmpty().withMessage("Il nome non può essere vuoto.").escape(),
    body("surname").optional().trim().notEmpty().withMessage("Il cognome non può essere vuoto.").escape(),
    body("email").optional().trim().notEmpty().withMessage("L'email non può essere vuota.").isEmail().withMessage("Inserisci una email valida.").normalizeEmail(),
    body("password").optional({ checkFalsy: true }).isStrongPassword().withMessage("La nuova password deve contenere minimo 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero e 1 simbolo."),
    body("role").optional().trim().isIn(['agencyAdmin', 'agent', 'user', 'admin']).withMessage("Ruolo non valido."),
    body("agencyId").optional().isInt().withMessage("L'ID agenzia deve essere un numero intero.") 
];