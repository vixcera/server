import compression from "compression";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import limiter from "express-rate-limit"
import express from 'express';
import helmet from "helmet";
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import router from './router/router.js';
import connectDB from './config/database.js';

const app = express();
const port = 3000;
const server = new http.createServer(app);

dotenv.config();

app.use(cors({ credentials: true, origin: ['https://vixcera.my.id', 'http://localhost:5173'] }));
app.use(helmet.contentSecurityPolicy({ directives: { "script-src" : ["'self'", "code.jquery.com", "cdn.jsdelivr.net"] } }))
app.use(limiter({ windowMs: 1 * 60 * 1000 , max: 20 }))
app.use(express.urlencoded({ extended: true }));
app.use(compression())
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(router);

connectDB().then(() => {
  server.listen(port, (error) => { (error) ? console.log(error.msessage) : console.log('==> server running'); });
});
