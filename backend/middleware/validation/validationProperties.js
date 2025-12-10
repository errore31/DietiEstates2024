import { body } from "express-validator";

export const validationCreateProperties = [
    body("title").trim().notEmpty().withMessage("Il titolo è obbligatorio").isLength({ min: 2, max: 100 }).withMessage("Il titolo deve avere tra 2 e 100 caratteri").escape(),
    body("description").trim().notEmpty().withMessage("La descrizione è obbligatoria").isLength({ min: 10, max: 3000 }).withMessage("La descrizione deve avere tra 10 e 3000 caratteri").escape(),
    body("price").notEmpty().withMessage("Il prezzo è obbligatorio").isFloat({ gt: 0 }).withMessage("Il prezzo deve essere un numero positivo maggiore di 0").toFloat(),
    body("address").trim().notEmpty().withMessage("L'indirizzo è obbligatorio").isLength({ min: 5, max: 255 }).withMessage("L'indirizzo deve avere tra 5 e 255 caratteri").escape(),
    body("type").trim().notEmpty().withMessage("Il tipo di proprietà è obbligatorio").isLength({ min: 2, max: 15 }).withMessage("Il tipo di proprietà deve avere tra 2 e 15 caratteri").escape(),
    body("latitude").trim().notEmpty().withMessage("la latitudine deve essere inserita").isFloat().escape(),
    body("longitude").trim().notEmpty().withMessage("la longitudine deve essere inserita").isFloat().escape()
];

export const validationUpdateProperties = [
    body("title").optional().trim().notEmpty().withMessage("Il titolo non può essere vuoto").isLength({ min: 2, max: 100 }).withMessage("Il titolo deve avere tra 2 e 100 caratteri").escape(),
    body("description").optional().trim().notEmpty().withMessage("La descrizione non può essere vuota").isLength({ min: 10, max: 3000 }).withMessage("La descrizione deve avere tra 10 e 3000 caratteri").escape(),
    body("price").optional().notEmpty().withMessage("Il prezzo non può essere vuoto").isFloat({ gt: 0 }).withMessage("Il prezzo deve essere un numero positivo maggiore di 0").toFloat(),
    body("address").optional().trim().notEmpty().withMessage("L'indirizzo non può essere vuoto").isLength({ min: 5, max: 255 }).withMessage("L'indirizzo deve avere tra 5 e 255 caratteri").escape(),
    body("type").optional().trim().notEmpty().withMessage("Il tipo di proprietà non può essere vuoto").isLength({ min: 2, max: 15 }).withMessage("Il tipo di proprietà deve avere tra 2 e 15 caratteri").escape(),
    body("latitude").trim().notEmpty().withMessage("la latitudine deve essere inserita").isFloat().escape(),
    body("longitude").trim().notEmpty().withMessage("la longitudine deve essere inserita").isFloat().escape()
];