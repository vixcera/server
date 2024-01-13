import jwt from 'jsonwebtoken';
import { rm } from 'fs';
import path from 'path';
import date from 'date-time';
import bcyrpt from 'bcryptjs';
import detector from '../utils/detector.js';
import { contributor, users } from "../models/models.js"
import nodemailer from '../utils/nodemailer.js';
import randomize from '../utils/randomize.js';

export const ready = async (request, response) => {
  response.status(200).redirect(`${process.env.clientUrl}`)
};

export const user_login = async (request, response) => {
  const agent = request.headers['user-agent'] + '' + request.ip
  const { email , password } = request.body;
  const user = await users.findOne({ where: { email } });
  if (!user) return response.status(404).json('account not found!');
  try {
    const match = await bcyrpt.compare(password, user.password);
    if (!match) return response.status(403).json("password doesn't match!");

    const token = jwt.sign({
      vid: user.vid,
      img: user.img,
      email: user.email,
      username: user.username,
      password: user.password,
    }, process.env.token, {
      expiresIn: '20s',
    });

    const reftoken = jwt.sign({
      vid: user.vid,
      email: user.email,
      username: user.username,
    }, process.env.reftoken, {
      expiresIn: '1d',
    });

    await users.update({ reftoken, agent }, { where: { email } })
    const now = date({ date: new Date(), showMilliseconds: true });

    response.cookie('reftoken', reftoken, {httpOnly: true, sameSite:"none", secure:true, maxAge: 24 * 60 * 60 * 1000,});
    response.json({ token });
  } catch (error) {
    return response.status(403).json(error.message);
  }
};

export const user_register = async (request, response) => {
  const { email, username, password } = request.body;
  const user = await users.findOne({ where: { email } });
  if (!email.includes('@gmail.com')) return response.status(422).json('please input a valid email!');
  if (user) return response.status(403).json('email has been registered, please enter another email!');
  if (email && username && password) {
    const token = jwt.sign({
      vid : randomize(3),
      email,
      username,
      password,
    }, process.env.token);
    const url = `${request.protocol}://${request.get("host")}/confirm/user/${token}`;
    nodemailer(email, username, url, response);
  } else return response.status(403).json('data is incomplete, please complete the data!');
};

export const user_confirm = async (request, response) => {
  const { token } = request.params;
  if (!token) return response.status(404).json('data not found');

  jwt.verify(token, process.env.token, async (error) => {
    if (error) return response.status(403).json(error.message);
    const data = jwt.decode(token);
    const user = await users.findOne({ where: { email: data.email } });
    if (user) return response.status(403).redirect(`${process.env.clientUrl}/login`);
    const salt = await bcyrpt.genSalt();
    const hash = await bcyrpt.hash(data.password, salt);
    await users.create({
      username: data.username, password: hash, email: data.email, vid: data.vid
    });
    response.status(201).redirect(`${process.env.clientUrl}/login`);
  });
};

export const user_logout = async (request, response) => {
  const agent = request.headers['user-agent'] + '' + request.ip
  const user = await users.findOne({ where: { agent } })
  const cont = await contributor.findOne({ where: { agent } })
  if (user) await users.update({ reftoken: null, agent: null }, { where: { agent } })
  if (cont) await contributor.update({ reftoken: null, agent: null }, { where: { agent } })
  response.clearCookie('reftoken');
  response.status(200).json('successfully logout');
};

export const getUser = async (request, response) => {
  const { reftoken } = request.cookies;
  if (!reftoken) return response.status(403).json('kamu tidak memiliki akses');
  const user = await users.findOne({ attributes: ['username', 'id', 'email', 'img'] }, { where: { reftoken } });
  if (!user) return response.status(404).json('user not found');
  response.status(200).json(user);
};

export const updateUser = async (request, response) => {
  const agent = request.headers['user-agent'] + '' + request.ip
  const user = await users.findOne({ where: { agent } });
  if (!user) return response.status(404).json('user not found');
  if (!request.files) return response.status(404).json('empty data');

  const { img } = request.files;
  const ext = path.extname(img.name);
  const imgsize = img.data.length;
  const imgname = img.md5 + ext;
  const imgtype = ['.png', '.jpg', '.jpeg'];
  const imgurl = `${request.protocol}://${request.get('host')}/images/user/${imgname}`;
  if (!img) return response.status(404).json('empty file');
  if (imgsize > 5000000) return response.status(403).json('file size must be less than 5 MB');
  if (!imgtype.includes(ext.toLowerCase())) return response.status(422).json('format file tidak didukung');
  
  img.mv(`./public/images/user/${imgname}`, async (error) => {
    if (error) throw error;
    try {
      const url = `${request.protocol}://${request.get('host')}/images/user/`;
      if (user.img) { rm(`./public/images/user/${user.img.slice(url.length)}`, (error) => console.log(error)); }
      await users.update({ img: imgurl }, { where : { agent } })
      response.status(200).json('successfully updated profile photo');
    } catch (error) { response.status(403).json(error.message); }
  });
};
