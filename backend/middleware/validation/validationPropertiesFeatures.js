import { body } from "express-validator";

export const validationCreatePropertiesFeatures = [
    body("roomCount").notEmpty().withMessage("Il numero di stanze è obbligatorio").isInt({ min: 0, max: 100 }).withMessage("Il numero di stanze deve essere un intero valido (0-100)").toInt(),
    body("area").notEmpty().withMessage("L'area è obbligatoria").isInt({ min: 1, max: 100000 }).withMessage("L'area deve essere un intero positivo").toInt(),
    body("hasElevator").notEmpty().withMessage("Il campo ascensore è obbligatorio").isBoolean().withMessage("Il campo ascensore deve essere un valore booleano").toBoolean(),
    body("floor").notEmpty().withMessage("Il piano è obbligatorio").isInt({ min: -10, max: 200 }).withMessage("Il piano deve essere un intero valido").toInt(),
    body("energyClass").trim().notEmpty().withMessage("La classe energetica è obbligatoria").isIn(["A4", "A3", "A2", "A1", "B", "C", "D", "E", "F", "G"]).withMessage("Classe energetica non valida (es. A4, B, C...)").escape()
];

export const validationUpdatePropertiesFeatures = [
    body("roomCount").optional().notEmpty().withMessage("Il numero di stanze non può essere vuoto").isInt({ min: 0, max: 100 }).withMessage("Il numero di stanze deve essere un intero valido (0-100)").toInt(),
    body("area").optional().notEmpty().withMessage("L'area non può essere vuota").isInt({ min: 1, max: 100000 }).withMessage("L'area deve essere un intero positivo").toInt(),
    body("hasElevator").optional().notEmpty().withMessage("Il campo ascensore non può essere vuoto").isBoolean().withMessage("Il campo ascensore deve essere un valore booleano").toBoolean(),
    body("floor").optional().notEmpty().withMessage("Il piano non può essere vuoto").isInt({ min: -10, max: 200 }).withMessage("Il piano deve essere un intero valido").toInt(),
    body("energyClass").optional().trim().notEmpty().withMessage("La classe energetica non può essere vuota")
    .isIn(["A4", "A3", "A2", "A1", "B", "C", "D", "E", "F", "G"]).withMessage("Classe energetica non valida").escape()
];