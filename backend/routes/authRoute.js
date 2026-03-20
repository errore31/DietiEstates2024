import express from 'express';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/usersController.js';
import { validationSignup, validationLogin } from '../middleware/validation/validationAuth.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { enforceAuthentication } from '../middleware/authorization.js';
import passport from '../services/passportGoogle.js';

export const authRouter = express.Router();

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
authRouter.post('/', validationLogin, errorValidation, async (req, res, next) => {

    try {
        const user = await authController.checkCredential(req, res);

        if (user) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.name = user.name;
            req.session.surname = user.surname;
            req.session.email = user.email;
            req.session.role = user.role;
            req.session.agencyId = user.agencyId | null;
            req.session.auth = true;
            res.status(200).json({
                message: "Login effettuato con successo",
                user: user
            });
        } else {
            res.status(401).json({ error: "Credenziali non valide. Riprova." });
        }
    } catch (error) {
        next(error);
    }

});

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/
authRouter.post('/signup', validationSignup, errorValidation, async (req, res, next) => {

    try {
        req.body.role = "user";
        const user = await userController.createUser(req, res);

        res.status(201).json({
            message: "Utente salvato con successo",
            user: user
        });

    } catch (error) {
        next(error);
    }

});

authRouter.get('/session', (req, res) => {
    if (req.session && req.session.auth) {
        res.status(200).json({
            loggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                name: req.session.name,
                surname: req.session.surname,
                email: req.session.email,
                role: req.session.role,
                agencyId: req.session.agencyId
            }
        });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

authRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Errore nel logout" });
        res.clearCookie('connect.sid');
        res.json({ message: "Logout effettuato" });
    });
});

//Google route
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            return res.redirect('http://localhost:4200/login?error=server_error');
        }

        if (!user) {
            const errorMsg = info && info.message ? info.message : 'auth_failed';
            return res.redirect(`http://localhost:4200/auth?error=${errorMsg}`);
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.name = user.name;
        req.session.surname = user.surname;
        req.session.email = user.email;
        req.session.auth = true;

        res.redirect('http://localhost:4200/');
    })(req, res, next);
});

authRouter.get('/user', enforceAuthentication, async (req, res, next) => {
    try {
        const user = await userController.getUser(req);
        res.send(user);
    } catch (error) {
        next(error);
    }
})