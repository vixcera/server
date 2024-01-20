import express from "express";
import { contributor_confirm, contributor_login, contributor_logout, contributor_register } from '../controllers/contributor.js';

const rcontributor = new express.Router()

rcontributor.get('/logout/contributor', contributor_logout);
rcontributor.get('/confirm/contributor/:token', contributor_confirm);

rcontributor.post('/login/contributor', contributor_login);
rcontributor.post('/register/contributor', contributor_register);


export default rcontributor;