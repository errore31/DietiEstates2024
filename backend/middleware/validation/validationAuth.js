/**
 * This middleware controls the input for Login and Signup
 */

import { body} from "express-validator";

export const validationSignup = [
    body("username").trim().notEmpty().withMessage("L'username è obbligatorio.").escape(),
    body("name").trim().notEmpty().withMessage("Il nome è obbligatorio.").escape(),
    body("surname").trim().notEmpty().withMessage("Il cognome è obbligatorio.").escape(),
    body("email").trim().notEmpty().withMessage("L'email è obbligatoria.").isEmail().withMessage("Inserisci una email valida.").normalizeEmail(),
    body("password").notEmpty().withMessage("La password è obbligatoria.").isStrongPassword().withMessage("La password deve contenere minimo 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero e 1 simbolo."),
    body("role").trim().notEmpty().withMessage("Il ruolo è obbligatorio.").isIn(['admin', 'agencyAdmin', 'agent', 'user']).withMessage("Ruolo non valido.")
]

export const validationLogin =[
    body("username").trim().notEmpty().withMessage("L'username è obbligatorio.").escape(),
    body("password").notEmpty().withMessage("La password è obbligatoria.")
]