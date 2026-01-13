import express from 'express';
import { propertiesController } from '../controllers/propertiesController.js'
import { imagesController } from '../controllers/imagesController.js';
import { enforceAuthentication } from '../middleware/authorization.js';
import { ensureIsAgent } from '../middleware/authorization.js';
import { ensureAgentOwnsProperty } from '../middleware/authorization.js';
import { validationCreateProperties, validationUpdateProperties } from '../middleware/validation/validationProperties.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { uploadImage } from '../middleware/uploadPhoto.js';

export const proprietiesRouter = express.Router();

/**
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/

proprietiesRouter.post('/create', enforceAuthentication, ensureIsAgent, uploadImage, validationCreateProperties, errorValidation,  async (req, res, next) => {

    try {
        const propriety = await propertiesController.createProperty(req);
        if (propriety) {
            res.status(201).json({
                message: "Proprietà aggiunta con successo!",
                propriety: { id: propriety.id }
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

proprietiesRouter.delete('/delete/:id', enforceAuthentication, ensureAgentOwnsProperty, async (req, res, next) => {

    try {
        const idProperty = req.params.id;
        await propertiesController.deleteProperty(idProperty); 

        res.status(200).json({
            message: "Proprietà eliminata con successo!",
            propriety: {}
        });
    } catch (error) {
        next(error);
    }

});



proprietiesRouter.put('/update/:id', enforceAuthentication, ensureAgentOwnsProperty, validationUpdateProperties, errorValidation, async (req, res, next) => {

    try {
        const idProperty = req.params.id;
        const updatedProperty = await propertiesController.updateProperty(idProperty, req);
        res.status(200).json({
            message: "Proprietà aggiornata con successo!",
            data: updatedProperty 
        });
    } catch (error) {
        next(error);
    }

});

proprietiesRouter.delete('/images/delete/:id', async (req, res, next) =>{
    try{
        const imageId = req.params.id;
        await imagesController.deleteImage(imageId);
         res.status(200).json({
            message: "Immagine eliminata con successo!",
        });
    }catch(error){
        next(error);
    }
});

proprietiesRouter.put('/images/update/:id', async(req, res, next) =>{
     try{
        const imageId = req.params.id;
        const updateImage = await imagesController.updateImage(req, imageId);
         res.status(200).json({
            message: "Immagine modificata con successo!",
            data: updateImage
        });
    }catch(error){
        next(error);
    }

});


proprietiesRouter.get('/:id', async(req, res, next) =>{
     try{
         const propertyId = req.params.id;
        const property = await propertiesController.getProperty(propertyId, req);
        res.send(property);
    }catch(error){
        next(error);
    }

});
