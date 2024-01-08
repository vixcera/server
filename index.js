import compression from "compression";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import express from 'express';
import helmet from "helmet";
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router/router.js';
import connectDB from './config/database.js';

const app = express();
dotenv.config();
connectDB()

app.use(cors({ credentials: true, origin: ['https://vixcera.my.id', 'http://localhost:5173'] }));
app.use(helmet.contentSecurityPolicy({ directives: { "script-src" : ["'self'", "code.jquery.com", "cdn.jsdelivr.net"] } }))
app.use(express.urlencoded({ extended: true }));
app.use(compression())
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(router);


app.listen(3000, (error) => { (error) ? console.log(error.msessage) : console.log('==> server running'); });