import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import router from './router/router.js';
import db from "./config/database.js"
import express from 'express';
import helmet from "helmet"
import dotenv from 'dotenv';
import https from "https";
import http from "http";
import cors from 'cors';
import hpp from "hpp"
import fs from "fs"

const options = {
    key  : fs.readFileSync('./certificate/localhost-key.pem'),
    cert : fs.readFileSync('./certificate/localhost.pem')
}

const cspoptions = {
    directives : {
        defaultSrc  : ["'self'"],
        scriptSrc   : [ "'self'" ],
        styleSrc    : [ "'self'", "'unsafe-inline'" ],
        imgSrc      : [ "'self'", "vixcera.my.id"]
    }
}

const corsoptions = {
    credentials     : true,
    methods         : ['GET', 'PUT', 'POST', "DELETE"],
    origin          : ["https://vixcera.my.id", "http://localhost:5173/"],
    exposedHeaders  : ["set-cookie"]
}

dotenv.config();
const app = express();
const host = process.env.host
const port = process.env.port
const serverhttps = new https.createServer(options, app)
const serverhttp = new http.createServer(app)

app.enable("trust proxy", 1)
app.disable('x-powered-by')

app.use(cors(corsoptions));
app.use(cookieParser());
app.use(hpp())

app.use( helmet.contentSecurityPolicy(cspoptions));
app.use( helmet.xssFilter( { setOnOldIE: true }));
app.use( helmet.hsts( { maxAge: 7776000000 }));
app.use( helmet.frameguard( 'SAMEORIGIN' ));
app.use( helmet.noSniff() ) ;

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(router);

db.authenticate()
.then(() => console.log("==> database connected"))
.catch((error) => console.log(error))
serverhttp.listen(port, (error) => { (error) ? console.log(error.msessage) : console.log('==> server running') })