import { Router } from 'express';
import {isValidPassword, generateJWToken} from '../util.js';

import StudentService from '../services/db/students.service.js';
import { createHash } from '../util.js';

const router = Router();
const studentService = new StudentService();

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await studentService.findByUsername(email);
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(400).send({error: "Not found", message: "Usuario no encontrado con username: " + email});
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"});
        }
        const tokenUser= {
            name : `${user.name} ${user.lastName}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
     
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            httpOnly: true
        });
        res.send({message: "Login successful!"});
       
    } catch (error) {
        console.error(error);
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."});
    }
});

router.post("/register", async (req, res) => {
    const { name, lastName, email, age, password} = req.body;

    const exists = await studentService.findByUsername(email);
    if (exists) {
        return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
    };

    const user = {
        name,
        lastName,
        email,
        age,
        password: createHash(password)
    };

    const result = await studentService.save(user);

    res.status(200).send({ status: 'succes', message: "Usuario creado con exito con ID: " + result.id});
});



export default router;