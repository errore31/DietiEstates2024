import { Notifications } from "../models/database.js";

export class notificationsController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async createNotification(req, res) {
        return Notifications.create({
            type: req.body.type,
            message: req.body.message,
            isRead: req.body.isRead,
            userId: req.body.userId
        });
    }

    static async readNotification(req, res) {
        const updateData = {
            isRead: true,
        };
        return Notifications.update(
            updateData,
            {where: {id : req.id} });
    }

}