import { body} from "express-validator";

export const validationSignup = [
    body("username").trim().notEmpty().withMessage("L'username è obbligatorio.").escape(),
    body("nome").trim().notEmpty().withMessage("Il nome è obbligatorio.").escape(),
    body("cognome").trim().notEmpty().withMessage("Il cognome è obbligatorio.").escape(),
    body("email").trim().notEmpty().withMessage("L'email è obbligatoria.").isEmail().withMessage("Inserisci una email valida.").normalizeEmail(),
    body("password").notEmpty().withMessage("La password è obbligatoria.").isStrongPassword().withMessage("La password deve contenere minimo 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero e 1 simbolo.")
]