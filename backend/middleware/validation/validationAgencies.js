import { body } from "express-validator";

export const validationCreateAgency = [
    body("businessName").trim().notEmpty().withMessage("Il nome dell'azienda è obbligatorio").isLength({ min: 2, max: 150 }).withMessage("Il nome dell'azienda deve avere tra 2 e 150 caratteri"),
    body("name").trim().notEmpty().withMessage("Il nome è obbligatorio").isLength({ min: 2, max: 100 }).withMessage("Il nome deve avere tra 2 e 100 caratteri"),
    body("address").trim().notEmpty().withMessage("L'indirizzo è obbligatorio").isLength({ min: 5, max: 255 }).withMessage("L'indirizzo deve avere tra 5 e 255 caratteri"),
    body("phone").trim().notEmpty().withMessage("Il telefono è obbligatorio").isLength({ min: 6, max: 20 }).withMessage("Il numero di telefono non è valido").matches(/^[0-9\s\+]+$/).withMessage("Il telefono può contenere solo numeri, spazi e il simbolo +"),
    body("email").trim().notEmpty().withMessage("L'email è obbligatoria").isLength({ max: 100 }).withMessage("L'email non può superare i 100 caratteri").isEmail().withMessage("Indirizzo email non valido").normalizeEmail({ gmail_remove_dots: false }),
];

export const validationUpdateAgency = [
    body("businessName").optional().trim().notEmpty().withMessage("Il nome dell'azienda non può essere vuoto").isLength({ min: 2, max: 150 }).withMessage("Il nome dell'azienda deve avere tra 2 e 150 caratteri"),
    body("name").optional({ checkFalsy: true }).trim().notEmpty().withMessage("Il nome non può essere vuoto").isLength({ min: 2, max: 100 }).withMessage("Il nome deve avere tra 2 e 100 caratteri"),
    body("address").optional({ checkFalsy: true }).trim().notEmpty().withMessage("L'indirizzo non può essere vuoto").isLength({ min: 5, max: 255 }).withMessage("L'indirizzo deve avere tra 5 e 255 caratteri"),
    body("phone").optional({ checkFalsy: true }).trim().notEmpty().withMessage("Il telefono non può essere vuoto").isLength({ min: 6, max: 20 }).withMessage("Il numero di telefono non è valido").matches(/^[0-9\s\+]+$/).withMessage("Il telefono può contenere solo numeri, spazi e il simbolo +"),
    body("email").optional({ checkFalsy: true }).trim().notEmpty().withMessage("L'email non può essere vuota").isLength({ max: 100 }).withMessage("L'email non può superare i 100 caratteri").isEmail().withMessage("Indirizzo email non valido").normalizeEmail({ gmail_remove_dots: false }),
];