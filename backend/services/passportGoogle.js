import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Users } from '../models/database.js';

passport.use(new GoogleStrategy({
    clientID: process.env.ID_CLIENT,
    clientSecret: process.env.SECRET_CLIENT,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // 1. Cerchiamo se l'utente esiste già nel DB tramite googleId
            let user = await Users.findOne({ where: { googleId: profile.id } });

            if (user) {
                return done(null, user);
            }

            // 2. Se non esiste, lo creiamo usando i dati forniti da Google
            user = await Users.create({
                googleId: profile.id,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                username: profile.emails[0].value.split('@')[0], // Generiamo un username dall'email
                role: 'user'
            });

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

// Serve per salvare l'utente nella sessione
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id);
    done(null, user);
});

export default passport;