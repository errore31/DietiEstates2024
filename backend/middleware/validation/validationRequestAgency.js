import { body } from "express-validator";

export const validationCreateRequestAgency = [
    body("businessName")
        .trim().notEmpty().withMessage("Il nome dell'azienda è obbligatorio")
        .isLength({ min: 2, max: 150 }).withMessage("Il nome dell'azienda deve avere tra 2 e 150 caratteri"),

    body("agencyName")
        .trim().notEmpty().withMessage("Il nome commerciale è obbligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("Il nome commerciale deve avere tra 2 e 100 caratteri"),

    body("address")
        .trim().notEmpty().withMessage("L'indirizzo è obbligatorio")
        .isLength({ min: 5, max: 255 }).withMessage("L'indirizzo deve avere tra 5 e 255 caratteri"),

    body("phone")
        .trim().notEmpty().withMessage("Il telefono è obbligatorio")
        .isLength({ min: 6, max: 20 }).withMessage("Il numero di telefono non è valido")
        .matches(/^[0-9\s\+]+$/).withMessage("Il telefono può contenere solo numeri, spazi e il simbolo +"),

    body("email")
        .trim().notEmpty().withMessage("L'email è obbligatoria")
        .isLength({ max: 100 }).withMessage("L'email non può superare i 100 caratteri")
        .isEmail().withMessage("Indirizzo email non valido")
        .normalizeEmail({ gmail_remove_dots: false }),

    body("name")
        .trim().notEmpty().withMessage("Il nome del richiedente è obbligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("Il nome deve avere tra 2 e 100 caratteri"),

    body("surname")
        .trim().notEmpty().withMessage("Il cognome del richiedente è obbligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("Il cognome deve avere tra 2 e 100 caratteri"),

    body("username")
        .trim().notEmpty().withMessage("Lo username è obbligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("Lo username deve avere tra 3 e 50 caratteri")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Lo username può contenere solo lettere, numeri e underscore"),
];
