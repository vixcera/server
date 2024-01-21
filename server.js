import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import compression from "compression"
import express from 'express';
import helmet from "helmet";
import dotenv from 'dotenv';
import chalk from 'chalk';
import https from "https";
import http from "http";
import cors from 'cors';
import hpp from "hpp";
import fs from "fs";

import { handlevxsrf,  protectvxsrf } from './cookies/vxsrf.js';
import country from "./security/country.js"
import router from './router/router.js';
import redos from './security/redos.js';
import db from "./config/database.js"

const options = {
    key  : fs.readFileSync('./certificate/vixcera.com-key.pem'),
    cert : fs.readFileSync('./certificate/vixcera.com.pem')
}

const cspoptions = {
    directives : {
        defaultSrc  : [ "'self'" ],
        scriptSrc   : [ "'self'" ],
        styleSrc    : [ "'self'", "'unsafe-inline'" ],
        imgSrc      : [ "vixcera.my.id", "api.vixcera.bid" ]
    }
}

const corsoptions = {
    credentials     : true,
    methods         : ['GET', 'PUT', 'POST', "DELETE"],
    origin          : ["https://vixcera.my.id", "http://localhost:5173"],
}

const hstsoptions = {
    maxAge            : 31536000,
    includesubdomains : true
}

dotenv.config();
const app = express();
const host = process.env.host
const port = process.env.port
const serverhttps = new https.createServer(options, app)
const serverhttp = new http.createServer(app)

app.enable("trust proxy", 1)
app.disable('x-powered-by')

app.use( cors(corsoptions));
app.use( cookieParser());
app.use( hpp())

app.use( helmet.contentSecurityPolicy(cspoptions));
app.use( helmet.frameguard({action: "sameorigin"}));
app.use( helmet.hsts(hstsoptions));
app.use( helmet.xssFilter());
app.use( helmet.noSniff());

app.use(fileUpload());
app.use(compression())
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(protectvxsrf)
app.use(handlevxsrf)
app.use(country)
app.use(redos)
app.use(router);

db.authenticate()
.then( () => console.log(chalk.green("==> database connected")))
.catch( (error) => console.log(error.message))
serverhttps.listen(port, (error) => { (error) ? console.log(error.msessage) : console.log(chalk.green("==> server running")) })