import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import router from './router/router.js';
import db from "./config/database.js"
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";


dotenv.config();
const app = express();
const port = 3000
const api = new http.createServer(app)

app.set("trust proxy", 1)
app.use(cors({ credentials: true, origin: ['https://vixcera.my.id', 'http://localhost:5173'] }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(router);

db.authenticate()
.then(() => console.log("==> database connected"))
.catch((error) => console.log(error))
api.listen(port, (error) => { (error) ? console.log(error.msessage) : console.log('==> server running') })