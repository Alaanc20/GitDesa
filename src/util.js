import {fileURLToPath} from 'url';
import { dirname } from 'path';


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}


export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

export const generateJWToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '120s'}); 
};


export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};


export default __dirname;

