import express from 'express';
import __dirname from './util.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';

import passport from 'passport';
import initializePassport from './config/passport.config.js';




import studentRouter from './routes/students.router.js'
import coursesRouter from './routes/courses.router.js'
import viewsRouter from "./routes/views.router.js";
import usersViewRouter from './routes/users.view.router.js'
import jwtRouter from './routes/jwt.router.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))



app.use(cookieParser("CoderS3cr3tC0d3"));

initializePassport();
app.use(passport.initialize());


app.use('/',viewsRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", coursesRouter);
app.use("/users", usersViewRouter);
app.use("/api/jwt", jwtRouter);

const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/colegio?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();