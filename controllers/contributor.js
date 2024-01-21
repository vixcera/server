import jwt from 'jsonwebtoken';
import bcyrpt from 'bcryptjs';
import { contributor } from '../models/models.js';
import nodemailer from '../utils/nodemailer.js';
import randomize from '../utils/randomize.js';

export const contributor_login = async (request, response) => {
  const agent = request.headers['user-agent'] + '' + request.ip
  const { email, password } = request.body;
  const cont = await contributor.findOne({ where: { email } });
  if (!cont) return response.status(404).json('account not found');
  try {
    const match = await bcyrpt.compare(password, cont.password);
    if (!match) return response.status(403).json("password doesn't match!");

    const token = jwt.sign({
      vid: cont.vid,
      img: cont.img,
      email: cont.email,
      username: cont.username,
      password: cont.password,
    }, process.env.token, {
      expiresIn: '20s',
    });

    const vxrft = jwt.sign({
      vid: cont.vid,
      img: cont.img,
      email: cont.email,
      username: cont.username,
    }, process.env.vxrft, {
      expiresIn: '1d',
    });

    await contributor.update({ agent, vxrft }, { where: { email } })
    response.cookie('vxrft', vxrft, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });
    response.json({ token });
  } catch (error) {
    return response.status(403).json(error.message);
  }
};

export const contributor_register = async (request, response) => {
  const { username, email, password } = request.body;
  if (!email.includes('@gmail.com')) return response.status(403).json('please input a valid email!');
  const cont = await contributor.findOne({ where: { email } });
  if (cont) return response.status(302).json('email has been registered, please enter another email!');

  if (email && username && password) {
    const token = jwt.sign({
      vid: randomize(3),
      email,
      username,
      password,
    }, process.env.token, {
      expiresIn: '15m',
    });
    const url = `${request.protocol}://${request.get("host")}/confirm/contributor/${token}`;
    nodemailer(email, username, url, response);
  } else {
    return response.status(400).send('incomplete data');
  }
};

export const contributor_confirm = async (request, response) => {
  const { token } = request.params;
  if (!token) return response.status(404).json('data not found!');

  jwt.verify(token, process.env.token, async (error) => {
    if (error) return response.status(400).json(error.message);

    const data = jwt.decode(token);
    const cont = await contributor.findOne({ where: { email: data.email } });
    if (cont) return response.status(403).redirect(`${process.env.clientUrl}/login/contributor`);
    const salt = await bcyrpt.genSalt();
    const hash = await bcyrpt.hash(data.password, salt);
    await contributor.create({
      vid: data.vid,
      email: data.email,
      username: data.username,
      password: hash,
    });
    response.status(201).redirect(`${process.env.clientUrl}/login/contributor`);
  });
};

export const contributor_logout = async (request, response) => {
  const agent = request.headers['user-agent'] + '' + request.ip
  const cont = await contributor.findOne({ agent });
  if (!cont) return response.status('you have been logged out!');
  await contributor.update({ agent: null, vxrft: null }, { where: { agent } });
  response.clearCookie('vxrft');
  response.status(200).json('successfully logged out');
};
