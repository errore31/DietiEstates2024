import { Notifications, Users } from "../models/database.js";
import { Op } from "sequelize";

export class notificationsController {
    /**
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async createNotification(req, res) {
        const user = await Users.findByPk(req.body.userId);

        if (user) {
            if (req.body.type === 'promo' && user.receivePromos === false) {
                return null;
            }
            if (req.body.type === 'property' && user.receiveProperties === false) {
                return null;
            }
        }

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
            { where: { id: req.body.id } });
    }
    static async getNotifications(req, res) {
        try {
            const notifications = await Notifications.findAll({
                where: { userId: req.session.userId },
                order: [['createdAt', 'DESC']]
            });

            const formattedNotifications = notifications.map(n => {
                let title = 'Nuova Notifica';
                if (n.type === 'property') {
                    title = 'Nuovo Immobile Compatibile';
                } else if (n.type === 'promo') {
                    title = 'Nuova Promozione / Annuncio';
                }

                return {
                    id: n.id,
                    title: title,
                    message: n.message,
                    type: n.type,
                    date: n.createdAt,
                    isRead: n.isRead
                };
            });

            res.status(200).json(formattedNotifications);
        } catch (error) {
            console.error('Errore durante il recupero delle notifiche:', error);
            res.status(500).json({ error: 'Errore interno del server' });
        }
    }
}