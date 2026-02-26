import express from 'express';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/usersController.js';
import { validationSignup, validationLogin } from '../middleware/validation/validationAuth.js';
import { errorValidation } from '../middleware/validation/errorValidation.js';
import { enforceAuthentication } from '../middleware/authorization.js';
import passport from '../services/passportGoogle.js'; 

export const authRouter = express.Router();

/**
 * This route handles user authentication
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
 * This route handles user authentication
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 **/ 
authRouter.post('/signup', validationSignup, errorValidation, async (req, res, next) =>{

    try{
        req.body.role = "user";
        const user = await userController.createUser(req, res);

        res.status(201).json({
            message: "Utente salvato con successo",
            user: user
        });

    } catch (error){
        next(error);
    }

});

authRouter.get('/session', (req, res) => {
    if (req.session && req.session.auth) {  // Check if session exists and user is authenticated
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

//Callback dove Google rimanda l'utente
authRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/login' }),
  (req, res) => {
    // Il login ha avuto successo
    // Salviamo i dati nella TUA sessione
    req.session.userId = req.user.id;
    req.session.username = req.user.username;
    req.session.role = req.user.role;
    req.session.name = req.user.name;
    req.session.surname = req.user.surname;
    req.session.email = req.user.email;
    req.session.auth = true;

    // Reindirizziamo l'utente alla home di Angular
    res.redirect('http://localhost:4200/');
  }
);

authRouter.get('/user', enforceAuthentication, async(req, res, next) => {
    try{
        const user = await userController.getUser(req);
        res.send(user);
    }catch (error){
        next(error);
    }
})