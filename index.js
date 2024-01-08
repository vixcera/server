import compression from "compression";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import mongoose from "mongoose";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router/router.js';

const app = express();
dotenv.config();

mongoose.connect(`${process.env.mongourl}`)
.then(() => console.log("==> database connected"))
.catch((error) => {console.log(error.message), process.exit(1)})

app.use(cors({ credentials: true, origin: ['https://vixcera.my.id', 'http://localhost:5173'] }));
app.use(express.urlencoded({ extended: true }));
app.use(compression())
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(router);


app.listen((error) => { (error) ? console.log(error.msessage) : console.log('==> server running'); });