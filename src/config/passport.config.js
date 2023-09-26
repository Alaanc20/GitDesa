import passport from "passport";
import jwtStrategy from 'passport-jwt';
import { PRIVATE_KEY } from "../util.js";

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        const SERIALIZED_USER = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        done(null, SERIALIZED_USER);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) { 
        token = req.cookies['jwtCookieToken'];
    }
    return token;
};

export default initializePassport;
