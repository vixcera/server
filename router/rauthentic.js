import express from "express";
import vxrft from "../cookies/vxrft.js";
import placeOrder  from '../controllers/payment.js';
import verifyToken from '../middleware/verify_token.js';
import { getvxsrf, checkvxsrf } from "../cookies/vxsrf.js";

const rauthentic = new express.Router()

rauthentic.get('/vxrft', vxrft);
rauthentic.get('/getvxsrf', getvxsrf)
rauthentic.get('/checkvxsrf', checkvxsrf)
rauthentic.get('/administrator', verifyToken);
rauthentic.post('/payments', placeOrder);

export default rauthentic;