import express from 'express';
import { notificationsController } from '../controllers/notificationsController.js';
import { enforceAuthentication } from '../middleware/authorization.js';

export const notificationsRouter = express.Router();

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
notificationsRouter.post('/', async (req, res, next) => {

    try {
        const notification = await notificationsController.createNotification(req, res);
        res.status(201).json({
            message: "Notifica inviata con successo",
            notification: { id: notification.id, type: notification.type, message: notification.message, createdAt: notification.createdAt, isRead: notification.isRead, userId: notification.userId }
        });
    } catch (error) {
        next(error);
    }

});


/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
notificationsRouter.put('/read', enforceAuthentication, async (req, res, next) => {

    try {
        const notification = req.body;
        if (notification) {
            await notificationsController.readNotification(notification);
            res.status(200).json({
                message: "Notifica letta con successo",
                notification: {}
            });
        } else {
            res.status(401).json({ error: "Richiesta non valida. Riprova." });
        }

    } catch (error) {
        next(error);
    }

});


/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
notificationsRouter.get('/get', enforceAuthentication, async (req, res, next) => {
    try {
        await notificationsController.getNotifications(req, res);
    } catch (error) {
        next(error);
    }
});