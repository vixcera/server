import express from "express";
import verify_token from "../middleware/verify_token.js";
import { updateUser, getUser, user_login, user_register, user_confirm, user_logout } from '../controllers/users.js';

const ruser = new express.Router()

ruser.get('/logout', user_logout);
ruser.get('/user/:id', verify_token, getUser);
ruser.get('/confirm/user/:token', user_confirm);

ruser.put('/user/update', updateUser);

ruser.post('/login', user_login);
ruser.post('/register', user_register);

export default ruser;