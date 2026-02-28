import express from 'express';
import { userController } from '../controllers/usersController.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { enforceAuthentication, ensureIsAgencyAdmin } from '../middleware/authorization.js';
import { validationUpdateUser } from '../middleware/validation/validationUsers.js';
import { validationSignup } from '../middleware/validation/validationAuth.js';


export const userRouter = express.Router();

userRouter.post('/createAgent', enforceAuthentication, ensureIsAgencyAdmin, validationSignup, errorValidation, async (req, res, next) => {

    try{
        const user = await userController.createUser(req, res);

        res.status(201).json({
            message: "Agente salvato con successo",
            user: user
        });

    } catch (error){
        next(error);
    }

});

userRouter.delete('/delete/:id', enforceAuthentication, ensureIsAgencyAdmin, async (req, res, next) => {

    try {
        const idUser = req.params.id;
        await userController.deleteUser(idUser); 

        res.status(200).json({
            message: "Utente eliminato con successo!",
        });
    } catch (error) {
        next(error);
    }

});

userRouter.put('/updateUser/:id', enforceAuthentication, validationUpdateUser, errorValidation, async (req, res, next) => {

    try {
        const idUser = req.params.id;
        const user = await userController.updateUser(idUser, req);
        res.status(200).json({
            message: "Utente aggiornato con successo!",
            user: user 
        });
    } catch (error) {
        next(error);
    }
});

userRouter.put('/updateAgent/:id', enforceAuthentication, ensureIsAgencyAdmin, validationUpdateUser, errorValidation, async (req, res, next) => {

    try {
        const idUser = req.params.id;
        const user = await userController.updateUser(idUser, req);
        res.status(200).json({
            message: "Utente aggiornato con successo!",
            user: user 
        });
    } catch (error) {
        next(error);
    }

});